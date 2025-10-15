import { TahunAjaran } from '@prisma/client'
import { ActionFunctionArgs } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import { ActionDataAdminMasterTahunAjaranDelete } from '~/types/actions-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataAdminMasterTahunAjaranDelete> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const tahunAjaranId = params.tahunAjaranId as TahunAjaran['id'] | null

    return await prisma.tahunAjaran
      .update({
        where: { id: tahunAjaranId ?? '' },
        data: {
          deletedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Tahun ajaran berhasil dihapus!',
          data: {
            deletedTahunAjaran: result,
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

export default function AdminMasterTahunAjaranDeleteRoute() {
  return <LoadingFullScreen />
}
