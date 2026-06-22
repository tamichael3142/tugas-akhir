import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import LAuthSetInitialPasswordPage from '~/pages/l-auth/SetInitialPassword'
import { LAuthSetInitialPasswordFormType, resolver } from '~/pages/l-auth/SetInitialPassword/form'
import { getValidatedFormData } from 'remix-hook-form'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import PasswordUtils from '~/utils/password.utils'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import DBUtils from '~/database/utils'
import { Role } from '~/database/enums/prisma.enums'
import { BaseActionData } from '~/types/actions-data/base-action'

export const meta: MetaFunction = () => {
  return constants.pageMetas.lAuthSetInitialPassword
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  if (currUser?.isChangedPassword) {
    const redirectUrl = DBUtils.auth.getGuardRedirectUrlBasedByRole(currUser?.role as Role)
    return redirect(redirectUrl)
  }

  return {}
}

export async function action({ request }: ActionFunctionArgs): Promise<BaseActionData | Response> {
  const { errors, data } = await getValidatedFormData<LAuthSetInitialPasswordFormType>(request, resolver)
  if (errors) {
    return { success: false, error: errors, message: 'Data tidak valid!' }
  }

  const userId = await requireAuthCookie(request)

  try {
    if (data.password !== data.passwordVerification) throw { message: 'Password dan konfirmasi password harus sama!' }

    const currUser = await prisma.akun.findUnique({ where: { id: userId } })

    await prisma.akun
      .update({
        where: { id: userId ?? '' },
        data: {
          password: await PasswordUtils.hashPassword(data.password),
          isChangedPassword: true,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .catch(error => {
        throw prismaErrorHandler(error)
      })

    const redirectUrl = DBUtils.auth.getGuardRedirectUrlBasedByRole(currUser?.role as Role)
    return redirect(redirectUrl)
  } catch (error) {
    return {
      success: false,
      error: error,
      message: (error as { message?: string }).message ?? 'Unknown Error!',
    }
  }
}

export default function LAuthSetInitialPasswordRoute() {
  return <LAuthSetInitialPasswordPage />
}
