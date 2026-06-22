import { ActionFunctionArgs } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import { ActionDataGuruManageViolationsDelete } from '~/types/actions-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataGuruManageViolationsDelete> {
  try {
    const userId = await requireAuthCookie(request)
    if (!userId)
      throw {
        message: 'Unauthorized! User not logged in!',
      }

    const pelanggaranId = params.pelanggaranId as string | null

    const currPelanggaran = await prisma.pelanggaranPerKelas.findUnique({ where: { id: pelanggaranId ?? '' } })

    if (!currPelanggaran || !pelanggaranId)
      throw {
        message: 'Violation not found!',
      }

    return await prisma.pelanggaranPerKelas
      .update({
        where: { id: pelanggaranId },
        data: {
          deletedAt: new Date(),
          lastUpdateById: userId,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Violation deleted!',
          data: {
            deletedPelanggaran: result,
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

export default function GuruManageViolationsDeleteRoute() {
  return <LoadingFullScreen />
}
