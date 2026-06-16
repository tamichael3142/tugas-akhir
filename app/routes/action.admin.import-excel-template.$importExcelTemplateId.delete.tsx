import { ImportExcelTemplate } from '@prisma/client'
import { ActionFunctionArgs } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import { SYSTEM_IMPORT_EXCEL_TEMPLATE_IDS } from '~/pages/admin/ImportExcelTemplate/form-types'
import importExcelTemplateStorageManager from '~/storage-manager/importExcelTemplate.storageManager.server'
import { ActionDataAdminImportExcelTemplateDelete } from '~/types/actions-data/admin'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export async function action({ params }: ActionFunctionArgs): Promise<ActionDataAdminImportExcelTemplateDelete> {
  const importExcelTemplateId = params.importExcelTemplateId as ImportExcelTemplate['id'] | null

  if ((SYSTEM_IMPORT_EXCEL_TEMPLATE_IDS as readonly string[]).includes(importExcelTemplateId ?? '')) {
    return {
      success: false,
      error: 'Cannot delete system record.',
      message: 'This record cannot be deleted.',
      data: {},
    }
  }

  try {
    const current = await prisma.importExcelTemplate.findUnique({ where: { id: importExcelTemplateId ?? '' } })

    if (current?.filePath) {
      const storageManager = importExcelTemplateStorageManager()
      await storageManager.deleteFile({ fullPath: current.filePath })
    }

    const deleted = await prisma.importExcelTemplate
      .delete({ where: { id: importExcelTemplateId ?? '' } })
      .catch(error => {
        const prismaError = prismaErrorHandler(error)
        throw prismaError
      })

    return {
      success: true,
      message: 'Import template deleted!',
      data: { deletedImportExcelTemplate: deleted },
    }
  } catch (error) {
    return {
      success: false,
      error: error,
      message: (error as { message?: string }).message ?? 'Unknown Error!',
      data: {},
    }
  }
}

export default function AdminImportExcelTemplateDeleteRoute() {
  return <LoadingFullScreen />
}
