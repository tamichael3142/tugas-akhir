import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Role } from '~/database/enums/prisma.enums'
import DBUtils from '~/database/utils'
import AuthMainLayout from '~/layouts/auth/AuthMainLayout'
import { getAuthCookie, removeAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUserId = await getAuthCookie(request)

  if (sessionUserId) {
    const user = await prisma.akun.findUnique({ where: { id: sessionUserId } })

    if (!user) return removeAuthCookie()

    const redirectUrl = DBUtils.auth.getGuardRedirectUrlBasedByRole(user.role as Role)
    return redirect(redirectUrl)
  }

  return {}
}

export default function AuthRoute() {
  return <AuthMainLayout />
}
