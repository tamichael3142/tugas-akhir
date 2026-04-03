import { Kelas, MataPelajaran } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentCreate } from '~/types/actions-data/guru'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentCreate } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import GuruDaftarKelasDetailMataPelajaranDetailAttachmentCreatePage from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Attachment/Create'
import mapelAttachmentStorageManager from '~/storage-manager/mapelAttachment.storageManager.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageAttachment
}
export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentCreate> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null

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

  return { kelas, mataPelajaran } as LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentCreate
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentCreate> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  const formData = await request.formData()
  const title = formData.get('title') as string
  const description = formData.get('description') as string | undefined
  const file = formData.get('file') as File

  try {
    const kelasId = params.kelasId as Kelas['id'] | null
    const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null

    let uploadedFileInfo

    if (file) {
      const storageManager = mapelAttachmentStorageManager()
      uploadedFileInfo = await storageManager.upload({
        file: file,
        kelasId: kelasId ?? '',
        mataPelajaranId: mataPelajaranId ?? '',
      })
    }

    return await prisma.mataPelajaranAttachment
      .create({
        data: {
          mataPelajaranId: mataPelajaranId ?? '',
          kelasId: kelasId ?? '',
          title: title,
          description: description,
          path: uploadedFileInfo?.path ?? '',
          createdById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Lampiran berhasil dibuat!',
          data: {
            createdAttachment: result,
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
      data: {
        oldFormData: {
          title,
          description,
          path: null,
          file,
        },
      },
    }
  }
}

export default function GuruDaftarKelasDetailMataPelajaranDetailAttachmentCreateRoute() {
  return <GuruDaftarKelasDetailMataPelajaranDetailAttachmentCreatePage />
}
