import SupabaseStorageUtils from '~/utils/supabase.storage.server'
import { v6 } from 'uuid'
import BUCKETS from './bucket.constants'

const storage = SupabaseStorageUtils

type AkunProfileUploadType = {
  file: File
  akunId: string
  fullPath?: string
}

export default function akunProfileStorageManager() {
  const getFilePath = ({ akunId, extension }: { akunId: string; extension?: string }) => {
    let result = `profile/${akunId}`
    if (extension) result += `.${extension}`
    return result
  }

  const upload = async (params: AkunProfileUploadType) => {
    const ID = params.akunId ? params.akunId : v6()
    const result = await storage.uploadFile({
      bucket: BUCKETS.AKUN_PROFILE,
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
        bucket: BUCKETS.AKUN_PROFILE,
        path: params.fullPath,
      })
      .then(res => res)
      .catch(() => null)
  }

  const deleteFile = async (params: { fullPath: string }) => {
    try {
      return await storage.deleteFile({ bucket: BUCKETS.AKUN_PROFILE, path: params.fullPath })
    } catch {
      return false
    }
  }

  return { getFilePath, upload, getDownloadUrl, deleteFile }
}
