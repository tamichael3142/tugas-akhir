import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import AdminMasterTahunAjaranPage from '~/pages/admin/MasterTahunAjaran'
import { LoaderDataAdminMasterTahunAjaran } from '~/types/loaders-data/admin'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterTahunAjaran
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterTahunAjaran> {
  const tahunAjarans = await getPaginatedData({
    request,
    model: prisma.tahunAjaran,
    options: {
      defaultLimit: 10,
      orderBy: [{ nama: 'desc' }, { createdAt: 'desc' }],
    },
  })

  return {
    tahunAjarans,
  }
}

export default function AdminMasterTahunAjaranRoute() {
  return <AdminMasterTahunAjaranPage />
}
