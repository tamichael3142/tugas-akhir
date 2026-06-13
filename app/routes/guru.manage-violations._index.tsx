import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { endOfDay, startOfDay } from 'date-fns'
import constants from '~/constants'
import GuruManageViolationsPage from '~/pages/guru/ManageViolations'
import { LoaderDataGuruManageViolations } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageViolations
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataGuruManageViolations> {
  const userId = await requireAuthCookie(request)

  const accessibleKelasWhere = {
    OR: [{ waliId: userId }, { jadwalPelajarans: { some: { mataPelajaran: { guruId: userId } } } }],
  }

  const kelass = await prisma.kelas.findMany({
    where: { deletedAt: null, ...accessibleKelasWhere },
    orderBy: [{ nama: 'asc' }],
  })

  const mataPelajarans = await prisma.mataPelajaran.findMany({
    where: { deletedAt: null, guruId: userId },
    orderBy: [{ nama: 'asc' }],
  })

  const pelanggarans = await getPaginatedData({
    request,
    model: prisma.pelanggaranPerMapel,
    options: {
      defaultLimit: 10,
      where: {
        deletedAt: null,
        kelas: accessibleKelasWhere,
      },
      include: {
        siswa: true,
        kelas: true,
        mataPelajaran: true,
        createdBy: true,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            { siswa: { firstName: { contains: search, mode: 'insensitive' } } },
            { siswa: { lastName: { contains: search, mode: 'insensitive' } } },
            { siswa: { displayName: { contains: search, mode: 'insensitive' } } },
            { remark: { contains: search, mode: 'insensitive' } },
          ]
        }

        const kelasId = query.get('kelasId')
        if (kelasId) where.kelasId = kelasId

        const mataPelajaranId = query.get('mataPelajaranId')
        if (mataPelajaranId) where.mataPelajaranId = mataPelajaranId

        const startDate = query.get('startDate')
        const endDate = query.get('endDate')
        if (startDate || endDate) {
          where.createdAt = {
            ...(startDate && { gte: startOfDay(new Date(startDate)) }),
            ...(endDate && { lte: endOfDay(new Date(endDate)) }),
          }
        }

        return where
      },
      orderBy: [{ createdAt: 'desc' }],
    },
  })

  return { pelanggarans, kelass, mataPelajarans } as LoaderDataGuruManageViolations
}

export default function GuruManageViolationsRoute() {
  return <GuruManageViolationsPage />
}
