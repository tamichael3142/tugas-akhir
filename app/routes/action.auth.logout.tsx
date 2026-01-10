import { MetaFunction } from '@remix-run/react'
import { LoadingFullScreen } from '~/components/ui'
import constants from '~/constants'
import { removeAuthCookie } from '~/utils/auth.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.default
}

export async function action() {
  return removeAuthCookie()
}

export default function AuthLogoutRoute() {
  return <LoadingFullScreen />
}
