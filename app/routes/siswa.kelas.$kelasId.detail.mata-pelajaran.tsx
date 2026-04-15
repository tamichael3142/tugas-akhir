import { Kelas, SemesterAjaran, SemesterAjaranUrutan } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import SiswaKelasDetailMataPelajaranPage from '~/pages/siswa/Kelas/Detail/MataPelajaran'
import { LoaderDataSiswaKelasDetailMataPelajaran } from '~/types/loaders-data/siswa'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaKelas
}
export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataSiswaKelasDetailMataPelajaran> {
  const kelasId = params.kelasId as Kelas['id'] | null

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

  const currentSemesterUrutan = new Date().getMonth() < 6 ? SemesterAjaranUrutan.DUA : SemesterAjaranUrutan.SATU
  let currentSemester: SemesterAjaran | null = null

  if (currentTahunAjaran) {
    currentSemester = currentTahunAjaran.semesterAjaran.find(item => item.urutan === currentSemesterUrutan) ?? null
  }

  const mataPelajarans = await getPaginatedData({
    request,
    model: prisma.mataPelajaran,
    options: {
      defaultLimit: 50,
      include: { guru: true },
      where: {
        semesterAjaranId: currentSemester?.id,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let where: any = {}

        const jadwalPelajaransSomeAnd: object[] = [{ kelasId: kelasId ?? '' }]

        const search = query.get('search')
        if (search) {
          where.OR = [
            // ? Ini untuk search ke data yang di dalam reference
            { nama: { contains: search, mode: 'insensitive' } },
          ]
        }

        where = {
          ...where,
          jadwalPelajarans: {
            some: {
              AND: jadwalPelajaransSomeAnd,
            },
          },
        }

        return where
      },
      orderBy: [{ createdAt: 'desc' }],
    },
  })

  return { kelas, currentTahunAjaran, currentSemester, mataPelajarans } as LoaderDataSiswaKelasDetailMataPelajaran
}

export default function SiswaKelasDetailMataPelajaranRoute() {
  return <SiswaKelasDetailMataPelajaranPage />
}
