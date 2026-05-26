import { Kelas } from '@prisma/client'
import { ActionFunctionArgs } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import { ActionDataAdminMasterKelasDelete } from '~/types/actions-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataAdminMasterKelasDelete> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const kelasId = params.kelasId as Kelas['id'] | null

    if (!kelasId)
      throw {
        message: 'Class not found!',
      }

    const currKelas = await prisma.kelas.findUnique({ where: { id: kelasId, deletedAt: null } })

    if (!currKelas)
      throw {
        message: 'Class not found or already deleted!',
      }

    const deletedAt = new Date()
    return await prisma.kelas
      .update({
        where: { id: kelasId },
        data: {
          nama: `${currKelas.nama} (deleted-${new Date().getTime()})`,
          deletedAt,
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Class deleted!',
          data: {
            deletedKelas: result,
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

export default function AdminMasterKelasDeleteRoute() {
  return <LoadingFullScreen />
}
