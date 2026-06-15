import { endOfDay, startOfDay } from 'date-fns'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruManageAbsensiPage from '~/pages/guru/ManageAbsensi'
import { LoaderDataGuruManageAbsensi } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageAbsensi
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataGuruManageAbsensi> {
  const userId = await requireAuthCookie(request)

  const kelass = await prisma.kelas.findMany({
    where: { deletedAt: null, waliId: userId },
  })

  const tahunAjarans = await prisma.tahunAjaran.findMany({
    where: { deletedAt: null, id: { in: kelass.map(item => item.tahunAjaranId) } },
    include: { semesterAjaran: true },
    orderBy: [{ tahunMulai: 'desc' }],
  })

  const absensis = await getPaginatedData({
    request,
    model: prisma.absensi,
    options: {
      defaultLimit: 10,
      where: {
        kelas: { waliId: userId },
      },
      include: {
        kelas: true,
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
            { kelas: { nama: searchValue } },
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

        const tahunAjaranId = query.get('tahunAjaranId')
        if (tahunAjaranId) where = { ...where, semesterAjaran: { tahunAjaranId } }

        const semesterAjaranId = query.get('semesterAjaranId')
        if (semesterAjaranId) where = { ...where, semesterAjaranId }

        const startDate = query.get('startDate')
        const endDate = query.get('endDate')
        if (startDate || endDate) {
          where.tanggal = {
            ...(startDate && { gte: startOfDay(new Date(startDate)) }),
            ...(endDate && { lte: endOfDay(new Date(endDate)) }),
          }
        }

        return where
      },
      orderBy: [{ tanggal: 'desc' }, { createdAt: 'desc' }],
    },
  })

  return { absensis, tahunAjarans } as LoaderDataGuruManageAbsensi
}

export default function GuruManageAbsensiRoute() {
  return <GuruManageAbsensiPage />
}
