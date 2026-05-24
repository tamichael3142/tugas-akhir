import { Akun } from '@prisma/client'
import { ActionFunctionArgs } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import { ActionDataAdminMasterAccountResetPassword } from '~/types/actions-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import PasswordUtils from '~/utils/password.utils'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataAdminMasterAccountResetPassword> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const akunId = params.akunId as Akun['id'] | null
    const currAkun = await prisma.akun.findUnique({ where: { id: akunId ?? '' } })

    if (!akunId || !currAkun)
      throw {
        message: 'Akun tidak ditemukan!',
      }

    return await prisma.akun
      .update({
        where: { id: akunId },
        data: {
          password: await PasswordUtils.hashPassword(currAkun.username),
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Password reset success!',
          data: {
            updatedAkun: result,
          },
        }
      })
      .catch(error => {
        const prismaError = prismaErrorHandler(error)
        throw prismaError
      })
  } catch (error) {
    return {
      success: false,
      error: error,
      message: (error as { message?: string }).message ?? 'Unknown Error!',
      data: {},
    }
  }
}

export default function AdminMasterAccountResetPasswordRoute() {
  return <LoadingFullScreen />
}
