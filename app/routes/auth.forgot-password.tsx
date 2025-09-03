import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import ForgotPasswordPage from '~/pages/auth/ForgotPassword'

export const meta: MetaFunction = () => {
  return constants.pageMetas.authForgotPassword
}

export default function AuthLoginRoute() {
  return <ForgotPasswordPage />
}
