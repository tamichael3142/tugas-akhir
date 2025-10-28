import { zodResolver } from '@hookform/resolvers/zod'
import { Kelas } from '@prisma/client'
import * as z from 'zod'

export const validaionSchema = z.object({
  nama: z.string().min(2),
  tahunAjaranId: z.string().min(2),
  waliId: z.string(),
})

export type AdminMasterKelasCreateFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyUserValue: AdminMasterKelasCreateFormType = {
  nama: '',
  tahunAjaranId: '',
  waliId: '',
}

export function translateRawToFormData(data: Kelas): AdminMasterKelasCreateFormType {
  return {
    nama: data.nama ?? '',
    tahunAjaranId: data.tahunAjaranId,
    waliId: data.waliId ?? '',
  }
}
