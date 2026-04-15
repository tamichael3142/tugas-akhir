import { Kelas, SemesterAjaran, SemesterAjaranUrutan } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import SiswaKelasDetailMataPelajaranDetail from '~/pages/siswa/Kelas/Detail/MataPelajaran/Detail'
import { LoaderDataSiswaKelasDetailMataPelajaranDetail } from '~/types/loaders-data/siswa'
import { prisma } from '~/utils/db.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaKelas
}
export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataSiswaKelasDetailMataPelajaranDetail> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const mataPelajaranId = params.mataPelajaranId as Kelas['id'] | null

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

  return { kelas, currentTahunAjaran, currentSemester, mataPelajaran } as LoaderDataSiswaKelasDetailMataPelajaranDetail
}

export default function SiswaKelasDetailMataPelajaranDetailRoute() {
  return <SiswaKelasDetailMataPelajaranDetail />
}
