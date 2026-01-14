import { MetaFunction, redirect } from '@remix-run/react'
import constants from '~/constants'
import { requireAuthCookie } from '~/utils/auth.utils'
import { LoaderFunctionArgs, TypedResponse } from '@remix-run/node'
import { prisma } from '~/utils/db.server'
import { Role } from '~/database/enums/prisma.enums'
import DBUtils from '~/database/utils'
import { LoaderDataGuru } from '~/types/loaders-data/guru'
import GuruDashboardLayout from '~/layouts/guru/GuruDashboard'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruDefault
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataGuru | TypedResponse<never>> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })
  if (currUser?.role !== Role.GURU) {
    const redirectUrl = DBUtils.auth.getGuardRedirectUrlBasedByRole(currUser?.role as Role)
    return redirect(redirectUrl)
  }

  return { user: currUser }
}

export default function GuruRoute() {
  return <GuruDashboardLayout />
}
