import { MetaFunction, redirect } from '@remix-run/react'
import constants from '~/constants'
import { requireAuthCookie } from '~/utils/auth.utils'
import { LoaderFunctionArgs, TypedResponse } from '@remix-run/node'
import { prisma } from '~/utils/db.server'
import { Role } from '~/database/enums/prisma.enums'
import DBUtils from '~/database/utils'
import { LoaderDataOrtu } from '~/types/loaders-data/ortu'
import OrtuDashboardLayout from '~/layouts/ortu/OrtuDashboard'

export const meta: MetaFunction = () => {
  return constants.pageMetas.ortuDashboard
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataOrtu | TypedResponse<never>> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })
  if (currUser?.role !== Role.ORANGTUA) {
    const redirectUrl = DBUtils.auth.getGuardRedirectUrlBasedByRole(currUser?.role as Role)
    return redirect(redirectUrl)
  }

  return { user: currUser }
}

export default function OrtuRoute() {
  return <OrtuDashboardLayout />
}
