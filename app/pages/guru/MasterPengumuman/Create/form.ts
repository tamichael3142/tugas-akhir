import { zodResolver } from '@hookform/resolvers/zod'
import { Pengumuman } from '@prisma/client'
import * as z from 'zod'

export const validationSchema = z.object({
  nama: z.string().min(2),
  content: z.string().min(2),
})

export type GuruMasterPengumumanCreateFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

export const emptyUserValue: GuruMasterPengumumanCreateFormType = {
  nama: '',
  content: '',
}

export function translateRawToFormData(data: Pengumuman): GuruMasterPengumumanCreateFormType {
  return {
    nama: data.nama ?? '',
    content: data.content ?? '',
  }
}
