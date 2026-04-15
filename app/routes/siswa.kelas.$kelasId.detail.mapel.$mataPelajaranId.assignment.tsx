import { Kelas, MataPelajaran, SemesterAjaran, SemesterAjaranUrutan } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import SiswaKelasDetailMataPelajaranDetailAssignmentPage from '~/pages/siswa/Kelas/Detail/MataPelajaran/Detail/Assignment'
import { LoaderDataSiswaKelasDetailMataPelajaranDetailAssignment } from '~/types/loaders-data/siswa'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaMapelAssignment
}
export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataSiswaKelasDetailMataPelajaranDetailAssignment> {
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

  const assignments = await getPaginatedData({
    request,
    model: prisma.assignment,
    options: {
      defaultLimit: 10,
      where: {
        mataPelajaranId,
        kelasId,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        }

        return where
      },
      orderBy: [{ tanggalMulai: 'desc' }, { createdAt: 'desc' }],
    },
  })

  return {
    kelas,
    currentTahunAjaran,
    currentSemester,
    mataPelajaran,
    assignments,
  } as LoaderDataSiswaKelasDetailMataPelajaranDetailAssignment
}

export default function SiswaKelasDetailMataPelajaranDetailAssignmentRoute() {
  return <SiswaKelasDetailMataPelajaranDetailAssignmentPage />
}
