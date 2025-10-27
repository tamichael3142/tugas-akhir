import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import AdminMasterKelasPage from '~/pages/admin/MasterKelas'
import { LoaderDataAdminMasterKelas } from '~/types/loaders-data/admin'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterKelas
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterKelas> {
  const tahunAjarans = await prisma.tahunAjaran.findMany({ where: { deletedAt: null } })

  const kelass = await getPaginatedData({
    request,
    model: prisma.kelas,
    options: {
      defaultLimit: 10,
      include: {
        tahunAjaran: true,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            { nama: { contains: search, mode: 'insensitive' } },
            // ? NOTE: kalau mau in depth search juga bisa sperti di bawah ini
            // {
            //   tahunAjaran: {
            //     nama: { contains: search, mode: 'insensitive' },
            //   },
            // },
          ]
        }

        const tahunAjaranId = query.get('tahunAjaranId')
        if (tahunAjaranId) {
          where.tahunAjaranId = tahunAjaranId
        }

        return where
      },
      orderBy: [{ nama: 'desc' }, { createdAt: 'desc' }],
    },
  })

  return {
    tahunAjarans,
    kelass,
  } as LoaderDataAdminMasterKelas
}

export default function AdminMasterKelasRoute() {
  return <AdminMasterKelasPage />
}
