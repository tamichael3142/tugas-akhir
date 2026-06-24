import { Kelas } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { endOfDay, startOfDay } from 'date-fns'
import constants from '~/constants'
import DBHelpers from '~/database/helpers'
import GuruDaftarKelasDetailAbsensiListPage from '~/pages/guru/DaftarKelas/Detail/Absensi'
import { LoaderDataGuruDaftarKelasDetailAbsensiList } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import DateUtils from '~/utils/date.utils'
import { prisma } from '~/utils/db.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruDaftarKelas
}

export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailAbsensiList> {
  const userId = await requireAuthCookie(request)
  const url = new URL(request.url)
  const query = url.searchParams

  const kelasId = params.kelasId as Kelas['id'] | null

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId ?? '' },
    include: {
      tahunAjaran: { include: { semesterAjaran: true } },
      wali: true,
    },
  })

  const currentSemesterUrutan = DBHelpers.semesterAjaran.getTodaySemesterAjaranUrutan()
  const currentSemesterAjaran = kelas
    ? DBHelpers.semesterAjaran.getCurrentSemesterAjaranFromTahunAjaran({
        semesterAjaran: kelas.tahunAjaran.semesterAjaran,
        currentSemesterUrutan,
      })
    : null

  const date = query.get('date')
  const selectedDate = date ? new Date(date) : new Date()
  const dateTreshold = DateUtils.getADateTreshold(selectedDate)

  const todayAbsensi = currentSemesterAjaran
    ? await prisma.absensi.findFirst({
        where: {
          kelasId: kelas?.id,
          semesterAjaranId: currentSemesterAjaran.id,
          tanggal: { gte: dateTreshold.start, lt: dateTreshold.end },
        },
      })
    : null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    kelasId: kelasId ?? '',
    kelas: { waliId: userId },
  }

  const startDate = query.get('startDate')
  const endDate = query.get('endDate')
  if (startDate || endDate) {
    where.tanggal = {
      ...(startDate && { gte: startOfDay(new Date(startDate)) }),
      ...(endDate && { lte: endOfDay(new Date(endDate)) }),
    }
  }

  const absensis = await prisma.absensi.findMany({
    where,
    include: { kelas: true },
    orderBy: [{ tanggal: 'desc' }],
  })

  return { kelas, currentSemesterAjaran, absensis, todayAbsensi } as LoaderDataGuruDaftarKelasDetailAbsensiList
}

export default function GuruDaftarKelasDetailAbsensiListRoute() {
  return <GuruDaftarKelasDetailAbsensiListPage />
}
