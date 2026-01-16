import { Pengumuman } from '@prisma/client'
import { ActionFunctionArgs } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import { ActionDataGuruMasterPengumumanDelete } from '~/types/actions-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataGuruMasterPengumumanDelete> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const pengumumanId = params.pengumumanId as Pengumuman['id'] | null

    const deletedAt = new Date()
    return await prisma.pengumuman
      .update({
        where: { id: pengumumanId ?? '' },
        data: {
          deletedAt,
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Pengumuman berhasil dihapus!',
          data: {
            deletedPengumuman: result,
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

export default function GuruMasterPengumumanDeleteRoute() {
  return <LoadingFullScreen />
}
