import { MataPelajaranAttachment } from '@prisma/client'
import { ActionFunctionArgs } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentDelete } from '~/types/actions-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import mapelAttachmentStorageManager from '~/storage-manager/mapelAttachment.storageManager.server'

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentDelete> {
  try {
    const userId = await requireAuthCookie(request)
    if (!userId)
      throw {
        message: 'User belum login!',
      }

    const attachmentId = params.attachmentId as MataPelajaranAttachment['id'] | null

    const currAttachment = await prisma.mataPelajaranAttachment.findUnique({ where: { id: attachmentId ?? '' } })

    const storageManager = mapelAttachmentStorageManager()

    if (!currAttachment)
      throw {
        message: 'Lampiran tidak ditemukan!',
      }

    await storageManager.deleteFile({ fullPath: currAttachment.path })

    return await prisma.mataPelajaranAttachment
      .delete({
        where: { id: attachmentId ?? '' },
      })
      .then(result => {
        return {
          success: true,
          message: 'Lampiran berhasil dihapus!',
          data: {
            deletedAttachment: result,
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

export default function GuruDaftarKelasDetailMataPelajaranDetailAttachmentDeleteRoute() {
  return <LoadingFullScreen />
}
