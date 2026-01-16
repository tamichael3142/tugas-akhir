import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import AdminMasterEkstrakulikulerPage from '~/pages/admin/MasterEkstrakulikuler'
import { LoaderDataAdminMasterEkstrakulikuler } from '~/types/loaders-data/admin'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterEkstrakulikuler
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterEkstrakulikuler> {
  const tahunAjarans = await prisma.tahunAjaran.findMany({
    where: { deletedAt: null },
    orderBy: [{ nama: 'desc' }, { createdAt: 'desc' }],
  })
  const pengajars = await prisma.akun.findMany({
    where: {
      pengajarEkstrakulikuler: {
        some: {
          // ? Kalau hanya mau filter ekstrakulikuler yang belum didelete
          // deletedAt: null,
        },
      },
    },
  })

  const ekstrakulikulers = await getPaginatedData({
    request,
    model: prisma.ekstrakulikuler,
    options: {
      defaultLimit: 10,
      include: { tahunAjaran: true, pengajar: true },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            { nama: { contains: search, mode: 'insensitive' } },
            // ? NOTE: kalau mau in depth search
            // {
            //   tahunAjaran: {
            //     nama: { contains: search, mode: 'insensitive' },
            //   },
            // },
          ]
        }

        const tahunAjaranId = query.get('tahunAjaranId')
        if (tahunAjaranId) where.tahunAjaranId = tahunAjaranId

        const pengajarId = query.get('pengajarId')
        if (pengajarId) where.pengajarId = pengajarId

        return where
      },
      orderBy: [{ createdAt: 'desc' }],
    },
  })

  return {
    tahunAjarans,
    pengajars,
    ekstrakulikulers,
  } as LoaderDataAdminMasterEkstrakulikuler
}

export default function AdminMasterEkstrakulikulerRoute() {
  return <AdminMasterEkstrakulikulerPage />
}
