import { Akun } from '@prisma/client'
import { ActionFunctionArgs } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import { ActionDataAdminMasterAccountDelete } from '~/types/actions-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataAdminMasterAccountDelete> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const akunId = params.akunId as Akun['id'] | null

    return await prisma.akun
      .update({
        where: { id: akunId ?? '' },
        data: {
          // ? NOTES: bisa update username juga
          deletedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Akun berhasil dihapus!',
          data: {
            deletedAkun: result,
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

export default function AdminMasterAccountDeleteRoute() {
  return <LoadingFullScreen />
}
