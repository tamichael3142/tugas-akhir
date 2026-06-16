import { ImportExcelTemplate } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import AdminImportExcelTemplateEditPage from '~/pages/admin/ImportExcelTemplate/Edit'
import { SYSTEM_IMPORT_EXCEL_TEMPLATE_IDS } from '~/pages/admin/ImportExcelTemplate/form-types'
import importExcelTemplateStorageManager from '~/storage-manager/importExcelTemplate.storageManager.server'
import { ActionDataAdminImportExcelTemplateEdit } from '~/types/actions-data/admin'
import { LoaderDataAdminImportExcelTemplateEdit } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminImportExcelTemplate
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataAdminImportExcelTemplateEdit> {
  const importExcelTemplateId = params.importExcelTemplateId as ImportExcelTemplate['id'] | null
  const importExcelTemplate = await prisma.importExcelTemplate.findUnique({
    where: { id: importExcelTemplateId ?? '' },
  })

  let downloadUrl: string | null = null
  if (importExcelTemplate?.filePath) {
    const storageManager = importExcelTemplateStorageManager()
    downloadUrl = await storageManager.getDownloadUrl({ fullPath: importExcelTemplate.filePath }).catch(() => null)
  }

  return { importExcelTemplate, downloadUrl }
}

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataAdminImportExcelTemplateEdit> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  const importExcelTemplateId = params.importExcelTemplateId as ImportExcelTemplate['id'] | null

  const formData = await request.formData()
  const id = (formData.get('id') as string | null)?.trim() ?? ''
  const title = (formData.get('title') as string | null)?.trim() ?? ''
  const remark = (formData.get('remark') as string | null)?.trim() || undefined
  const file = formData.get('file') as File | null

  const isSystemRecord = (SYSTEM_IMPORT_EXCEL_TEMPLATE_IDS as readonly string[]).includes(importExcelTemplateId ?? '')

  const errors: { id?: string; title?: string } = {}
  if (!isSystemRecord && !id) errors.id = 'ID is required.'
  if (!title) errors.title = 'Title is required.'

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      error: errors,
      message: 'Validation failed.',
      data: { oldFormData: { id, title, remark }, errors },
    }
  }

  if (!isSystemRecord) {
    const conflicting = await prisma.importExcelTemplate.findFirst({
      where: { id, NOT: { id: importExcelTemplateId ?? '' } },
    })
    if (conflicting) {
      return {
        success: false,
        error: { id: 'ID already exists.' },
        message: 'ID already exists.',
        data: { oldFormData: { id, title, remark }, errors: { id: 'ID already exists.' } },
      }
    }
  }

  try {
    const current = await prisma.importExcelTemplate.findUnique({ where: { id: importExcelTemplateId ?? '' } })

    let filePath: string | null | undefined = undefined

    if (file && file.size > 0) {
      const storageManager = importExcelTemplateStorageManager()

      if (current?.filePath) {
        await storageManager.deleteFile({ fullPath: current.filePath })
      }

      const uploaded = await storageManager.upload({ file, templateId: importExcelTemplateId ?? id })
      filePath = uploaded.path
    }

    const updated = await prisma.importExcelTemplate.update({
      where: { id: importExcelTemplateId ?? '' },
      data: {
        ...(isSystemRecord ? {} : { id }),
        title,
        remark: remark ?? null,
        ...(filePath !== undefined ? { filePath } : {}),
        updatedAt: new Date(),
        lastUpdateById: currUser?.id,
      },
    })

    return {
      success: true,
      message: 'Import template updated!',
      data: { updatedImportExcelTemplate: updated },
    }
  } catch (error) {
    const prismaError = prismaErrorHandler(error)
    return {
      success: false,
      error: prismaError,
      message: prismaError.message ?? 'Unknown Error!',
      data: { oldFormData: { id, title, remark } },
    }
  }
}

export default function AdminImportExcelTemplateEditRoute() {
  return <AdminImportExcelTemplateEditPage />
}
