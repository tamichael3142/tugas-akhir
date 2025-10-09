import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import AdminMasterAccountPage from '~/pages/admin/MasterAccount'
import { LoaderDataAdminMasterAkun } from '~/types/loaders-data/admin'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterAccount
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterAkun> {
  const akuns = await getPaginatedData({
    request,
    model: prisma.akun,
    options: {
      defaultLimit: 10,
      orderBy: [{ createdAt: 'desc' }, { tanggalLahir: 'asc' }],
    },
  })

  return {
    akuns,
  }
}

export default function AdminMasterAccountRoute() {
  return <AdminMasterAccountPage />
}
