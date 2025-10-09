import { MetaFunction, redirect } from '@remix-run/react'
import constants from '~/constants'
import AdminDashboardLayout from '~/layouts/admin/AdminDashboard'
import { requireAuthCookie } from '~/utils/auth.utils'
import { LoaderFunctionArgs, TypedResponse } from '@remix-run/node'
import { prisma } from '~/utils/db.server'
import { LoaderDataAdmin } from '~/types/loaders-data/admin'
import { Role } from '~/database/enums/prisma.enums'
import DBUtils from '~/database/utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminDefault
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataAdmin | TypedResponse<never>> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })
  if (currUser?.role !== Role.ADMIN) {
    const redirectUrl = DBUtils.auth.getGuardRedirectUrlBasedByRole(currUser?.role as Role)
    return redirect(redirectUrl)
  }

  return { user: currUser }
}

export default function AdminRoute() {
  return <AdminDashboardLayout />
}
