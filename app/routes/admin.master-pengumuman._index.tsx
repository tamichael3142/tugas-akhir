import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import AdminMasterPengumumanPage from '~/pages/admin/MasterPengumuman'
import { LoaderDataAdminMasterPengumuman } from '~/types/loaders-data/admin'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterTahunAjaran
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterPengumuman> {
  const pengumumans = await getPaginatedData({
    request,
    model: prisma.pengumuman,
    options: {
      defaultLimit: 10,
      orderBy: [{ nama: 'desc' }, { createdAt: 'desc' }],
    },
  })

  return {
    pengumumans,
  }
}

export default function AdminMasterPengumumanRoute() {
  return <AdminMasterPengumumanPage />
}
