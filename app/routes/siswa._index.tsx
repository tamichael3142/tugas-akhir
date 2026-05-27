import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { prisma } from '~/utils/db.server'
import { LoaderDataSiswaIndex } from '~/types/loaders-data/siswa'
import SiswaDashboardPage from '~/pages/siswa/Dashboard'
import { LoaderFunctionArgs } from '@remix-run/node'
import { requireAuthCookie } from '~/utils/auth.utils'
import DBHelpers from '~/database/helpers'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaDashboard
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataSiswaIndex> {
  const userId = await requireAuthCookie(request)
  const now = new Date()
  let currentTahunAjaran = await prisma.tahunAjaran.findFirst({
    where: {
      tahunMulai: { lte: new Date() },
      tahunBerakhir: { gte: new Date() },
      deletedAt: null,
    },
    include: { semesterAjaran: true },
  })

  if (!currentTahunAjaran)
    currentTahunAjaran = await prisma.tahunAjaran.findFirst({
      include: { semesterAjaran: true },
      orderBy: { createdAt: 'desc' },
    })

  const currentSemesterUrutan = DBHelpers.semesterAjaran.getTodaySemesterAjaranUrutan()
  const currentSemester = DBHelpers.semesterAjaran.getCurrentSemesterAjaranFromTahunAjaran({
    currentSemesterUrutan,
    semesterAjaran: currentTahunAjaran?.semesterAjaran ?? [],
  })

  const days = await prisma.days.findMany({ orderBy: { sequenceNumber: 'asc' } })
  const hours = await prisma.hour.findMany({ orderBy: { sequenceNumber: 'asc' } })

  const jadwalPelajarans = await prisma.jadwalPelajaran.findMany({
    include: {
      kelas: true,
      mataPelajaran: {
        include: {
          semesterAjaran: true,
        },
      },
    },
    where: {
      semesterAjaranId: currentSemester?.id,
      kelas: {
        siswaPerKelasDanSemester: {
          some: { siswaId: userId },
        },
      },
    },
  })

  const assignments = await prisma.assignment.findMany({
    where: {
      OR: [
        { isSubmitable: true },
        {
          tanggalMulai: { lte: now },
          tanggalBerakhir: { gte: now },
        },
      ],
      mataPelajaran: {
        jadwalPelajarans: {
          some: {
            kelas: {
              siswaPerKelasDanSemester: {
                some: { siswaId: userId },
              },
            },
          },
        },
      },
    },
    include: {
      kelas: true,
      mataPelajaran: true,
    },
  })

  return {
    days,
    hours,
    jadwalPelajarans,
    assignments,
  } as LoaderDataSiswaIndex
}

export default function SiswaJadwalMengajarRoute() {
  return <SiswaDashboardPage />
}
