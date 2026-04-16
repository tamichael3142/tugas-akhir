import { Kelas, MataPelajaran } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import DBHelpers from '~/database/helpers'
import DBUtils from '~/database/utils'
import SiswaKelasDetailMataPelajaranDetailPenilaianPage from '~/pages/siswa/Kelas/Detail/MataPelajaran/Detail/Penilaian'
import { LoaderDataSiswaKelasDetailMataPelajaranDetailPenilaian } from '~/types/loaders-data/siswa'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaMapelPenilaian
}
export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataSiswaKelasDetailMataPelajaranDetailPenilaian> {
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

  const kompetensis = await prisma.kompetensi.findMany({
    orderBy: { sequenceNumber: 'asc' },
  })

  const siswa = await prisma.akun.findUnique({
    where: { id: userId },
  })

  const penilaians = await prisma.penilaian.findMany({
    where: {
      kelasId: kelasId ?? undefined,
      mataPelajaranId: mataPelajaran?.id,
      siswaId: siswa?.id,
    },
  })

  return {
    kelas,
    currentTahunAjaran,
    currentSemester,
    mataPelajaran,
    kompetensis,
    siswa,
    penilaians: [
      ...penilaians.map(item => ({
        ...item,
        nilai: DBUtils.decimal.decimalToNumber(item.nilai),
      })),
    ],
  } as LoaderDataSiswaKelasDetailMataPelajaranDetailPenilaian
}

export default function SiswaKelasDetailMataPelajaranDetailPenilaianRoute() {
  return <SiswaKelasDetailMataPelajaranDetailPenilaianPage />
}
