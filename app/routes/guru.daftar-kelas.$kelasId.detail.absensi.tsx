import { Kelas } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruDaftarKelasDetailAbsensiListPage from '~/pages/guru/DaftarKelas/Detail/Absensi'
import { LoaderDataGuruDaftarKelasDetailAbsensiList } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import DateUtils from '~/utils/date.utils'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

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
  const semesterAjaranId = query.get('semesterAjaranId')

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

  const date = query.get('date')
  const selectedDate = date ? new Date(date) : new Date()
  const dateTreshold = DateUtils.getADateTreshold(selectedDate)

  const todayAbsensi = semesterAjaranId
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

  const absensis = await getPaginatedData({
    request,
    model: prisma.absensi,
    options: {
      defaultLimit: 10,
      where: {
        kelasId: kelasId ?? '',
        kelas: {
          waliId: userId,
        },
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let where: any = {}

        const search = query.get('search')
        if (search) {
          const searchValue = { contains: search, mode: 'insensitive' }
          where.OR = [
            { label: searchValue },
            { tanggalText: searchValue },
            {
              siswaTerabsen: {
                some: {
                  OR: [
                    { siswa: { firstName: searchValue } },
                    { siswa: { lastName: searchValue } },
                    { siswa: { email: searchValue } },
                    { siswa: { username: searchValue } },
                    { siswa: { nip: searchValue } },
                  ],
                },
              },
            },
          ]
        }

        const semesterAjaranId = query.get('semesterAjaranId')
        if (semesterAjaranId) where = { ...where, semesterAjaranId }

        return where
      },
      orderBy: [{ tanggal: 'desc' }],
    },
  })

  return { kelas, absensis, todayAbsensi } as LoaderDataGuruDaftarKelasDetailAbsensiList
}

export default function GuruDaftarKelasDetailAbsensiListRoute() {
  return <GuruDaftarKelasDetailAbsensiListPage />
}
