import { MetaFunction, redirect } from '@remix-run/react'
import constants from '~/constants'
import { requireAuthCookie } from '~/utils/auth.utils'
import { LoaderFunctionArgs, TypedResponse } from '@remix-run/node'
import { prisma } from '~/utils/db.server'
import { Role } from '~/database/enums/prisma.enums'
import DBUtils from '~/database/utils'
import { LoaderDataSiswa } from '~/types/loaders-data/siswa'
import SiswaDashboardLayout from '~/layouts/siswa/SiswaDashboard'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaDashboard
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataSiswa | TypedResponse<never>> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })
  if (currUser?.role !== Role.SISWA) {
    const redirectUrl = DBUtils.auth.getGuardRedirectUrlBasedByRole(currUser?.role as Role)
    return redirect(redirectUrl)
  }

  return { user: currUser }
}

export default function SiswaRoute() {
  return <SiswaDashboardLayout />
}
