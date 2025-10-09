import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import AdminDashboardLayout from '~/layouts/admin/AdminDashboard'
import { requireAuthCookie } from '~/utils/auth.utils'
import { LoaderFunctionArgs } from '@remix-run/node'
import { prisma } from '~/utils/db.server'
import { LoaderDataAdmin } from '~/types/loaders-data/admin'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminDefault
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataAdmin> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  return { user: currUser }
}

export default function AdminRoute() {
  return <AdminDashboardLayout />
}
