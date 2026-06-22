import { LoaderFunctionArgs } from '@remix-run/node'
import AuthMainLayout from '~/layouts/auth/AuthMainLayout'
import { removeAuthCookie, requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'

// ? l-auth is for auth purposes but logged users only

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  if (!currUser) return removeAuthCookie()

  return {}
}

export default function LAuthRoute() {
  return <AuthMainLayout />
}
