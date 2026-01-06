import { Role } from '@prisma/client'
import { ActionFunctionArgs, TypedResponse } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import DBUtils from '~/database/utils'
import AppNav from '~/navigation'
import LoginPage from '~/pages/auth/Login'
import { AuthLoginFormType, authLoginResolver } from '~/pages/auth/Login/form'
import { ActionDataAuthLogin } from '~/types/actions-data/auth'
import { setAuthCookie } from '~/utils/auth.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.authLogin
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataAuthLogin | TypedResponse<never>> {
  const { errors, data } = await getValidatedFormData<AuthLoginFormType>(request, authLoginResolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const results = await DBUtils.auth.loginWithUsernameNIPAndPassword(data)
  const existingAkun = results.user

  if (results.success && existingAkun) {
    let nextUrl = AppNav.main.home()

    if (existingAkun.role === Role.ADMIN) nextUrl = AppNav.admin.dashboard()
    // TODO: do for other roles also

    return await setAuthCookie(existingAkun.id, nextUrl)
  }

  return {
    success: results.success,
    data: { user: results.user },
    error: results.errorType,
    message: results.message,
  }
}

export default function AuthLoginRoute() {
  return <LoginPage />
}
