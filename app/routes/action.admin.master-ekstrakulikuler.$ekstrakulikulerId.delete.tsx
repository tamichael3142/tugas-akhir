import { Ekstrakulikuler } from '@prisma/client'
import { ActionFunctionArgs } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import { ActionDataAdminMasterEkstrakulikulerDelete } from '~/types/actions-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataAdminMasterEkstrakulikulerDelete> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const ekstrakulikulerId = params.ekstrakulikulerId as Ekstrakulikuler['id'] | null

    const deletedAt = new Date()
    return await prisma.ekstrakulikuler
      .update({
        where: { id: ekstrakulikulerId ?? '' },
        data: {
          deletedAt,
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Ekstrakulikuler berhasil dihapus!',
          data: {
            deletedEkstrakulikuler: result,
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

export default function AdminMasterEkstrakulikulerDeleteRoute() {
  return <LoadingFullScreen />
}
