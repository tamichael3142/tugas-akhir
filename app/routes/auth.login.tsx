import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import LoginPage from '~/pages/auth/Login'

export const meta: MetaFunction = () => {
  return constants.pageMetas.authLogin
}

export default function AuthLoginRoute() {
  return <LoginPage />
}
