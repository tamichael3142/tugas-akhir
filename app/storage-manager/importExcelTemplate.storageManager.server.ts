import SupabaseStorageUtils from '~/utils/supabase.storage.server'
import { v6 } from 'uuid'
import BUCKETS from './bucket.constants'

const storage = SupabaseStorageUtils

type ImportExcelTemplateUploadType = {
  file: File
  templateId: string
  fullPath?: string
}

export default function importExcelTemplateStorageManager() {
  const getFilePath = ({ akunId, extension }: { akunId: string; extension?: string }) => {
    let result = `${akunId}`
    if (extension) result += `.${extension}`
    return result
  }

  const upload = async (params: ImportExcelTemplateUploadType) => {
    const ID = params.templateId ? params.templateId : v6()
    const result = await storage.uploadFile({
      bucket: BUCKETS.IMPORT_EXCEL_TEMPLATE,
      path: getFilePath({
        akunId: ID,
        extension: params.file.name.split('.').pop(),
      }),
      file: params.file,
    })

    return result
  }

  const getDownloadUrl = async (params: { fullPath: string }) => {
    return await storage
      .getPrivateUrl({
        bucket: BUCKETS.IMPORT_EXCEL_TEMPLATE,
        path: params.fullPath,
      })
      .then(res => res)
      .catch(() => null)
  }

  const deleteFile = async (params: { fullPath: string }) => {
    try {
      return await storage.deleteFile({ bucket: BUCKETS.IMPORT_EXCEL_TEMPLATE, path: params.fullPath })
    } catch {
      return false
    }
  }

  return { getFilePath, upload, getDownloadUrl, deleteFile }
}
