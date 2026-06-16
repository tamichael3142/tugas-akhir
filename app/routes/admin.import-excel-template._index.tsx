import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import AdminImportExcelTemplatePage from '~/pages/admin/ImportExcelTemplate'
import importExcelTemplateStorageManager from '~/storage-manager/importExcelTemplate.storageManager.server'
import { LoaderDataAdminImportExcelTemplate } from '~/types/loaders-data/admin'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminImportExcelTemplate
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataAdminImportExcelTemplate> {
  const storageManager = importExcelTemplateStorageManager()

  const importExcelTemplates = await getPaginatedData({
    request,
    model: prisma.importExcelTemplate,
    options: {
      defaultLimit: 10,
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}
        const search = query.get('search')
        if (search) {
          where.OR = [
            { id: { contains: search, mode: 'insensitive' } },
            { title: { contains: search, mode: 'insensitive' } },
            { remark: { contains: search, mode: 'insensitive' } },
          ]
        }
        return where
      },
      orderBy: [{ createdAt: 'desc' }],
    },
  })

  const dataWithDownloadUrl = await Promise.all(
    importExcelTemplates.data.map(async item => ({
      ...item,
      downloadUrl: item.filePath ? await storageManager.getDownloadUrl({ fullPath: item.filePath }) : null,
    })),
  )

  return {
    importExcelTemplates: {
      ...importExcelTemplates,
      data: dataWithDownloadUrl,
    },
  }
}

export default function AdminImportExcelTemplateRoute() {
  return <AdminImportExcelTemplatePage />
}
