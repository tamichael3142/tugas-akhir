import SupabaseStorageUtils from '~/utils/supabase.storage.server'
import { v6 } from 'uuid'
import BUCKETS from './bucket.constants'

const storage = SupabaseStorageUtils

type AssignmentSubmissionUploadType = {
  file: File
  kelasId: string
  mataPelajaranId: string
  assignmentId: string
  assignmentSubmissionId?: string
  fullPath?: string
}

export default function assignmentSubmissionStorageManager() {
  const getFilePath = ({
    kelasId,
    mataPelajaranId,
    assignmentId,
    assignmentSubmissionId,
    extension,
  }: {
    kelasId: string
    mataPelajaranId: string
    assignmentId: string
    assignmentSubmissionId?: string
    extension?: string
  }) => {
    let result = `${kelasId}/${mataPelajaranId}/${assignmentId}`
    if (assignmentSubmissionId) result += `/${assignmentSubmissionId}`
    if (extension) result += `.${extension}`
    return result
  }

  const upload = async (params: AssignmentSubmissionUploadType) => {
    const ID = params.assignmentSubmissionId ? params.assignmentSubmissionId : v6()
    const result = await storage.uploadFile({
      bucket: BUCKETS.ASSIGNMENT_SUBMISSION,
      path: getFilePath({
        kelasId: params.kelasId,
        mataPelajaranId: params.mataPelajaranId,
        assignmentId: params.assignmentId,
        assignmentSubmissionId: ID,
        extension: params.file.name.split('.').pop(),
      }),
      file: params.file,
    })

    return result
  }

  const getDownloadUrl = async (params: { fullPath: string }) => {
    return await storage
      .getPrivateUrl({
        bucket: BUCKETS.ASSIGNMENT_SUBMISSION,
        path: params.fullPath,
      })
      .then(res => res)
      .catch(() => null)
  }

  const deleteFile = async (params: { fullPath: string }) => {
    try {
      return await storage.deleteFile({ bucket: BUCKETS.ASSIGNMENT_SUBMISSION, path: params.fullPath })
    } catch {
      return false
    }
  }

  return { getFilePath, upload, getDownloadUrl, deleteFile }
}
