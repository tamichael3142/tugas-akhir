import { Kelas, MataPelajaran, MataPelajaranAttachment } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentEdit } from '~/types/actions-data/guru'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentEdit } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import mapelAttachmentStorageManager from '~/storage-manager/mapelAttachment.storageManager.server'
import GuruDaftarKelasDetailMataPelajaranDetailAttachmentEditPage from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Attachment/Edit'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageAttachment
}
export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentEdit> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null
  const attachmentId = params.attachmentId as MataPelajaranAttachment['id'] | null

  const storageManager = mapelAttachmentStorageManager()

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId ?? '' },
    include: {
      tahunAjaran: {
        include: {
          semesterAjaran: true,
        },
      },
      wali: true,
    },
  })

  const mataPelajaran = await prisma.mataPelajaran.findUnique({
    where: { id: mataPelajaranId ?? '' },
    include: {
      semesterAjaran: {
        include: {
          tahunAjaran: true,
        },
      },
      guru: true,
    },
  })

  const attachment = await prisma.mataPelajaranAttachment.findUnique({
    where: { id: attachmentId ?? '' },
  })

  return {
    kelas,
    mataPelajaran,
    attachment: { ...attachment, downloadUrl: storageManager.getDownloadUrl({ fullPath: attachment?.path ?? '' }) },
  } as LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentEdit
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentEdit> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  const kelasId = params.kelasId as Kelas['id'] | null
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null
  const attachmentId = params.attachmentId as MataPelajaranAttachment['id'] | null

  const formData = await request.formData()
  const title = formData.get('title') as string
  const description = formData.get('description') as string | undefined
  const file = formData.get('file') as File

  try {
    const currAttachment = await prisma.mataPelajaranAttachment.findUnique({ where: { id: attachmentId ?? '' } })

    if (!attachmentId || !currAttachment)
      throw {
        message: 'Lampiran tidak ditemukan!',
      }

    let uploadedFileInfo

    if (file && file.size > 0) {
      const storageManager = mapelAttachmentStorageManager()

      if (currAttachment.path) await storageManager.deleteFile({ fullPath: currAttachment.path })

      uploadedFileInfo = await storageManager.upload({
        file: file,
        kelasId: kelasId ?? '',
        mataPelajaranId: mataPelajaranId ?? '',
        attachmentId: currAttachment.id,
      })
    }

    return await prisma.mataPelajaranAttachment
      .update({
        where: { id: attachmentId },
        data: {
          title: title,
          description: description,
          path: uploadedFileInfo?.path,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Lampiran berhasil update!',
          data: {
            updatedAttachment: result,
          },
        }
      })
      .catch(error => {
        const prismaError = prismaErrorHandler(error)
        throw prismaError
      })
  } catch (error) {
    console.log(error)
    return {
      success: false,
      error: error,
      message: (error as { message?: string }).message ?? 'Unknown Error!',
      data: {
        oldFormData: {
          title,
          description,
          file,
          path: null,
        },
      },
    }
  }
}

export default function GuruDaftarKelasDetailMataPelajaranDetailAttachmentEditRoute() {
  return <GuruDaftarKelasDetailMataPelajaranDetailAttachmentEditPage />
}
