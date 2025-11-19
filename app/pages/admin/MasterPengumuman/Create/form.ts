import { zodResolver } from '@hookform/resolvers/zod'
import { Pengumuman } from '@prisma/client'
import * as z from 'zod'

export const validaionSchema = z.object({
  nama: z.string().min(2),
  content: z.string().min(2),
})

export type AdminMasterPengumumanCreateFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyUserValue: AdminMasterPengumumanCreateFormType = {
  nama: '',
  content: '',
}

export function translateRawToFormData(data: Pengumuman): AdminMasterPengumumanCreateFormType {
  return {
    nama: data.nama ?? '',
    content: data.content ?? '',
  }
}
