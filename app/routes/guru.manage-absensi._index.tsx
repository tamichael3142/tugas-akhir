import { endOfDay, startOfDay } from 'date-fns'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruManageAbsensiPage from '~/pages/guru/ManageAbsensi'
import { LoaderDataGuruManageAbsensi } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageAbsensi
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataGuruManageAbsensi> {
  const userId = await requireAuthCookie(request)
  const query = new URL(request.url).searchParams

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { kelas: { waliId: userId } }

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
    orderBy: [{ tanggal: 'desc' }, { createdAt: 'desc' }],
  })

  return { absensis } as LoaderDataGuruManageAbsensi
}

export default function GuruManageAbsensiRoute() {
  return <GuruManageAbsensiPage />
}
