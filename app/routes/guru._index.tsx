import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { LoaderDataGuruDashboard } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import DBHelpers from '~/database/helpers'
import GuruDashboardPage from '~/pages/guru'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruJadwalMengajar
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataGuruDashboard> {
  const userId = await requireAuthCookie(request)

  let currentTahunAjaran = await prisma.tahunAjaran.findFirst({
    where: {
      tahunMulai: { lte: new Date() },
      tahunBerakhir: { gte: new Date() },
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

  const currentDayID = DBHelpers.day.transformDateToDay(new Date())

  const days = await prisma.days.findMany({
    where: { id: currentDayID ?? undefined },
    orderBy: { sequenceNumber: 'asc' },
  })
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
      dayId: currentDayID ?? undefined,
      mataPelajaran: {
        guruId: userId,
      },
    },
  })

  return {
    currentTahunAjaran,
    currentSemester,
    days,
    hours,
    jadwalPelajarans,
  } as LoaderDataGuruDashboard
}

export default function GuruDashboardRoute() {
  return <GuruDashboardPage />
}
