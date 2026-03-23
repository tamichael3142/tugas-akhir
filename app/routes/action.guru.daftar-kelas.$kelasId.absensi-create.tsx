import { Kelas } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction, redirect } from '@remix-run/react'
import { format } from 'date-fns'
import { LoadingFullScreen } from '~/components/ui'
import constants from '~/constants'
import AppNav from '~/navigation'
import { requireAuthCookie } from '~/utils/auth.utils'
import DateUtils from '~/utils/date.utils'
import { prisma } from '~/utils/db.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruDaftarKelas
}
export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireAuthCookie(request)

  const kelasId = params.kelasId as Kelas['id'] | null
  const url = new URL(request.url)
  const query = url.searchParams

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

  const semesterAjaranId = query.get('semesterAjaranId')

  const date = query.get('date')
  const selectedDate = date ? new Date(date) : new Date()
  const dateTreshold = DateUtils.getADateTreshold(selectedDate)

  let absensi = semesterAjaranId
    ? await prisma.absensi.findFirst({
        where: {
          kelasId: kelas?.id,
          semesterAjaranId: semesterAjaranId,
          tanggal: {
            gte: dateTreshold.start,
            lt: dateTreshold.end,
          },
        },
      })
    : null

  if (!absensi) {
    if (!semesterAjaranId) return redirect(AppNav.guru.daftarKelasDetailAbsensiList({ kelasId: kelasId ?? '' }))

    const newTanggalText = format(selectedDate, constants.dateFormats.displayFullDate)
    absensi = await prisma.absensi.create({
      data: {
        label: `Absensi Harian Kelas: ${kelas?.nama} (${format(selectedDate, constants.dateFormats.dateMonthYearSimple)})`,
        tanggal: selectedDate,
        tanggalText: newTanggalText,
        kelasId: kelasId ?? '',
        semesterAjaranId: semesterAjaranId ?? '',
        createdAt: new Date(),
        createdById: userId,
        updatedAt: new Date(),
        lastUpdateById: userId,
      },
      include: {
        siswaTerabsen: true,
      },
    })
  }

  return redirect(AppNav.guru.manageAbsensiEdit({ absensiId: absensi.id }))
}

export default function GuruDaftarKelasDetailAbsensiRoute() {
  return <LoadingFullScreen />
}
