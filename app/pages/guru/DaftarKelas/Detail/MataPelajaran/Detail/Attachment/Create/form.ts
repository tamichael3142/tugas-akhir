import { zodResolver } from '@hookform/resolvers/zod'
import { MataPelajaranAttachment } from '@prisma/client'
import * as z from 'zod'

export const validationSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  path: z.string().optional().nullable(),
  file: z.any().nullable().optional(),
})

export type GuruDaftarKelasDetailMataPelajaranDetailAttachmentCreateFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

export const emptyValues: GuruDaftarKelasDetailMataPelajaranDetailAttachmentCreateFormType = {
  title: '',
  description: '',
  file: null,
  path: '',
}

export function translateRawToFormData(
  data: MataPelajaranAttachment,
): GuruDaftarKelasDetailMataPelajaranDetailAttachmentCreateFormType {
  return {
    title: data.title ?? '',
    description: data.description ?? '',
    file: null,
    path: data.path,
  }
}
