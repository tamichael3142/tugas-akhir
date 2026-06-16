import { ActionFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { v4 as uuidv4 } from 'uuid'
import constants from '~/constants'
import AdminImportExcelTemplateCreatePage from '~/pages/admin/ImportExcelTemplate/Create'
import importExcelTemplateStorageManager from '~/storage-manager/importExcelTemplate.storageManager.server'
import { ActionDataAdminImportExcelTemplateCreate } from '~/types/actions-data/admin'
import { LoaderDataAdminImportExcelTemplateCreate } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminImportExcelTemplate
}

export async function loader(): Promise<LoaderDataAdminImportExcelTemplateCreate> {
  return { defaultId: uuidv4() }
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataAdminImportExcelTemplateCreate> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  const formData = await request.formData()
  const id = (formData.get('id') as string | null)?.trim() ?? ''
  const title = (formData.get('title') as string | null)?.trim() ?? ''
  const remark = (formData.get('remark') as string | null)?.trim() || undefined
  const file = formData.get('file') as File | null

  const errors: { id?: string; title?: string } = {}
  if (!id) errors.id = 'ID is required.'
  if (!title) errors.title = 'Title is required.'

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      error: errors,
      message: 'Validation failed.',
      data: { oldFormData: { id, title, remark }, errors },
    }
  }

  const existing = await prisma.importExcelTemplate.findUnique({ where: { id } })
  if (existing) {
    return {
      success: false,
      error: { id: 'ID already exists.' },
      message: 'ID already exists.',
      data: { oldFormData: { id, title, remark }, errors: { id: 'ID already exists.' } },
    }
  }

  try {
    let filePath: string | undefined

    if (file && file.size > 0) {
      const storageManager = importExcelTemplateStorageManager()
      const uploaded = await storageManager.upload({ file, templateId: id })
      filePath = uploaded.path
    }

    const created = await prisma.importExcelTemplate.create({
      data: {
        id,
        title,
        remark: remark ?? null,
        filePath: filePath ?? null,
        createdById: currUser?.id,
        lastUpdateById: currUser?.id,
      },
    })

    return {
      success: true,
      message: 'Import template created!',
      data: { createdImportExcelTemplate: created },
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

export default function AdminImportExcelTemplateCreateRoute() {
  return <AdminImportExcelTemplateCreatePage />
}
