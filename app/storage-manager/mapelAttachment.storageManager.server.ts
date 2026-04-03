import SupabaseStorageUtils from '~/utils/supabase.storage.server'
import { v6 } from 'uuid'
import BUCKETS from './bucket.constants'

const storage = SupabaseStorageUtils

type MapelAttachmentUploadType = {
  file: File
  kelasId: string
  mataPelajaranId: string
  attachmentId?: string
  fullPath?: string
}

export default function mapelAttachmentStorageManager() {
  const getFilePath = ({
    kelasId,
    mataPelajaranId,
    attachmentId,
    extension,
  }: {
    kelasId: string
    mataPelajaranId: string
    attachmentId?: string
    extension?: string
  }) => {
    let result = `${kelasId}/${mataPelajaranId}`
    if (attachmentId) result += `/${attachmentId}`
    if (extension) result += `.${extension}`
    return result
  }

  const upload = async (params: MapelAttachmentUploadType) => {
    const ID = params.attachmentId ? params.attachmentId : v6()
    const result = await storage.uploadFile({
      bucket: BUCKETS.MAPEL_ATTACHMENT,
      path: getFilePath({
        kelasId: params.kelasId,
        mataPelajaranId: params.mataPelajaranId,
        attachmentId: ID,
        extension: params.file.name.split('.').pop(),
      }),
      file: params.file,
    })

    return result
  }

  const getDownloadUrl = (params: { fullPath: string }) => {
    return storage.getPublicUrl({
      bucket: BUCKETS.MAPEL_ATTACHMENT,
      path: params.fullPath,
    })
  }

  const deleteFile = async (params: { fullPath: string }) => {
    try {
      return await storage.deleteFile({ bucket: BUCKETS.MAPEL_ATTACHMENT, path: params.fullPath })
    } catch {
      return false
    }
  }

  return { getFilePath, upload, getDownloadUrl, deleteFile }
}
