import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import SiswaEkstrakulikulerPage from '~/pages/siswa/Ekstrakulikuler'
import { LoaderDataSiswaEkstrakulikuler } from '~/types/loaders-data/siswa'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaEkstrakulikuler
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataSiswaEkstrakulikuler> {
  const userId = await requireAuthCookie(request)

  const ekstrakulikulers = await getPaginatedData({
    request,
    model: prisma.ekstrakulikuler,
    options: {
      defaultLimit: 10,
      where: {
        deletedAt: null,
        siswaPerEkstrakulikuler: {
          some: { siswaId: userId },
        },
      },
      include: {
        tahunAjaran: true,
        pengajar: true,
      },
      orderBy: [{ createdAt: 'desc' }],
    },
  })

  return {
    ekstrakulikulers,
  } as LoaderDataSiswaEkstrakulikuler
}

export default function SiswaEkstrakulikulerRoute() {
  return <SiswaEkstrakulikulerPage />
}
