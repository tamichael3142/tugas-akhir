import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { prisma } from '~/utils/db.server'
import { LoaderDataSiswaIndex } from '~/types/loaders-data/siswa'
import SiswaDashboardPage from '~/pages/siswa/Dashboard'
import { SemesterAjaran, TahunAjaran } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { requireAuthCookie } from '~/utils/auth.utils'
import DBHelpers from '~/database/helpers'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaDashboard
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataSiswaIndex> {
  const userId = await requireAuthCookie(request)
  const now = new Date()
  let currentTahunAjaran: (TahunAjaran & { semesterAjaran: SemesterAjaran[] }) | null = null
  const currentTahunAjarans = await prisma.tahunAjaran.findMany({
    where: { deletedAt: null, tahunBerakhir: { gte: now }, tahunMulai: { lte: now } },
    include: { semesterAjaran: true },
    orderBy: [{ tahunBerakhir: 'desc' }, { createdAt: 'desc' }, { tahunMulai: 'desc' }],
  })

  const currentSemesterUrutan = DBHelpers.semesterAjaran.getTodaySemesterAjaranUrutan()
  let currentSemester: SemesterAjaran | null = null

  if (currentTahunAjarans && Array.isArray(currentTahunAjarans) && currentTahunAjarans.length) {
    currentTahunAjaran = currentTahunAjarans[0]
    currentSemester = DBHelpers.semesterAjaran.getCurrentSemesterAjaranFromTahunAjaran({
      currentSemesterUrutan,
      semesterAjaran: currentTahunAjaran?.semesterAjaran ?? [],
    })
  }

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

  return {
    days,
    hours,
    jadwalPelajarans,
    currentTahunAjaran: currentTahunAjarans,
  } as LoaderDataSiswaIndex
}

export default function SiswaJadwalMengajarRoute() {
  return <SiswaDashboardPage />
}
