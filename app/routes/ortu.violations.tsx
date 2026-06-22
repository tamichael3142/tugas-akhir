import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { endOfDay, startOfDay } from 'date-fns'
import constants from '~/constants'
import AppNav from '~/navigation'
import OrtuViolationsPage from '~/pages/ortu/Violations'
import { LoaderDataOrtuViolations } from '~/types/loaders-data/ortu'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.ortuViolations
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataOrtuViolations> {
  const url = new URL(request.url)
  const query = url.searchParams

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({
    where: { id: userId },
    include: {
      children: { include: { siswa: true } },
    },
  })

  if (!currUser) throw redirect(AppNav.auth.login())

  const siswaId = query.get('siswaId') as string | null

  if (!siswaId) {
    return {
      user: currUser,
      pelanggarans: {
        data: [] as never[],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
        filters: {},
      },
    } as LoaderDataOrtuViolations
  }

  if (!currUser.children.map(item => item.siswaId).includes(siswaId)) {
    throw redirect(AppNav.ortu.violations())
  }

  const pelanggarans = await getPaginatedData({
    request,
    model: prisma.pelanggaranPerKelas,
    options: {
      defaultLimit: 10,
      where: {
        deletedAt: null,
        siswaId,
      },
      include: {
        siswa: true,
        kelas: true,
        createdBy: true,
      },
      mapQueryToWhere: q => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = q.get('search')
        if (search) {
          where.OR = [
            { siswa: { firstName: { contains: search, mode: 'insensitive' } } },
            { siswa: { lastName: { contains: search, mode: 'insensitive' } } },
            { siswa: { displayName: { contains: search, mode: 'insensitive' } } },
            { remark: { contains: search, mode: 'insensitive' } },
          ]
        }

        const startDate = q.get('startDate')
        const endDate = q.get('endDate')
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

  return { user: currUser, pelanggarans } as LoaderDataOrtuViolations
}

export default function OrtuViolationsRoute() {
  return <OrtuViolationsPage />
}
