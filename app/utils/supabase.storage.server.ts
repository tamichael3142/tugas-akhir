import { supabase } from './supabase.server'

/**
 * Upload file ke Supabase Storage
 */
async function uploadFile({
  bucket,
  path,
  file,
  options,
}: {
  bucket: string
  path: string
  file: File | Blob
  options?: { upsert?: boolean; cacheControl?: string }
}) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: options?.upsert ?? true,
    cacheControl: options?.cacheControl,
  })

  if (error) throw new Error(error.message)
  return data
}

/**
 * Hapus file
 */
async function deleteFile({ bucket, path }: { bucket: string; path: string }) {
  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) throw new Error(error.message)
}

/**
 * Get public URL
 */
function getPublicUrl({ bucket, path }: { bucket: string; path: string }) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Get private URL
 */
async function getPrivateUrl({
  bucket,
  path,
  expiresIn = 60, // detik (default 1 menit)
}: {
  bucket: string
  path: string
  expiresIn?: number
}) {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

  if (error) {
    throw error
  }

  return data.signedUrl
}

/**
 * List files dalam folder
 */
async function listFiles({ bucket, folder }: { bucket: string; folder?: string }) {
  const { data, error } = await supabase.storage.from(bucket).list(folder || '', {
    limit: 100,
  })

  if (error) throw new Error(error.message)
  return data
}

const SupabaseStorageUtils = {
  uploadFile,
  deleteFile,
  getPublicUrl,
  getPrivateUrl,
  listFiles,
}

export default SupabaseStorageUtils
