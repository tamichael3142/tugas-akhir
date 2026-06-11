import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruManageEkstrakulikulerPage from '~/pages/guru/ManageEkstrakulikuler'
import { LoaderDataGuruManageEkstrakulikuler } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageEkstrakulikuler
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataGuruManageEkstrakulikuler> {
  const userId = await requireAuthCookie(request)

  const ekstrakulikulers = await getPaginatedData({
    request,
    model: prisma.ekstrakulikuler,
    options: {
      defaultLimit: 10,
      where: { deletedAt: null, pengajarId: userId },
      include: { tahunAjaran: true },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [{ nama: { contains: search, mode: 'insensitive' } }]
        }

        return where
      },
      orderBy: [{ createdAt: 'desc' }],
    },
  })

  return {
    ekstrakulikulers,
  } as LoaderDataGuruManageEkstrakulikuler
}

export default function GuruManageEkstrakulikulerRoute() {
  return <GuruManageEkstrakulikulerPage />
}
