import { Kelas, MataPelajaran } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import DBHelpers from '~/database/helpers'
import SiswaKelasDetailMataPelajaranDetailPelanggaranPage from '~/pages/siswa/Kelas/Detail/MataPelajaran/Detail/Pelanggaran'
import { LoaderDataSiswaKelasDetailMataPelajaranDetailPelanggaran } from '~/types/loaders-data/siswa'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaMapelPelanggaran
}
export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataSiswaKelasDetailMataPelajaranDetailPelanggaran> {
  const userId = await requireAuthCookie(request)

  const kelasId = params.kelasId as Kelas['id'] | null
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId ?? '' },
    include: {
      tahunAjaran: {
        include: {
          semesterAjaran: true,
        },
      },
      wali: true,
    },
  })

  const currentTahunAjaran = kelas?.tahunAjaran

  const currentSemesterUrutan = DBHelpers.semesterAjaran.getTodaySemesterAjaranUrutan()
  const currentSemester = DBHelpers.semesterAjaran.getCurrentSemesterAjaranFromTahunAjaran({
    currentSemesterUrutan,
    semesterAjaran: currentTahunAjaran?.semesterAjaran ?? [],
  })

  const mataPelajaran = await prisma.mataPelajaran.findUnique({
    where: { id: mataPelajaranId ?? '' },
    include: {
      semesterAjaran: {
        include: {
          tahunAjaran: true,
        },
      },
      guru: true,
    },
  })

  const pelanggarans = await getPaginatedData({
    request,
    model: prisma.pelanggaranPerMapel,
    options: {
      defaultLimit: 10,
      where: {
        mataPelajaranId,
        kelasId,
        siswaId: userId,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            { poin: { contains: search, mode: 'insensitive' } },
            { remark: { contains: search, mode: 'insensitive' } },
          ]
        }

        return where
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    },
  })

  return {
    kelas,
    currentTahunAjaran,
    currentSemester,
    mataPelajaran,
    pelanggarans,
  } as LoaderDataSiswaKelasDetailMataPelajaranDetailPelanggaran
}

export default function SiswaKelasDetailMataPelajaranDetailPelanggaranRoute() {
  return <SiswaKelasDetailMataPelajaranDetailPelanggaranPage />
}
