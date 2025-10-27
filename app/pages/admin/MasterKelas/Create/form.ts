import { zodResolver } from '@hookform/resolvers/zod'
import { Kelas, TahunAjaran } from '@prisma/client'
import * as z from 'zod'

export const validaionSchema = z.object({
  nama: z.string().min(2),
  tahunAjaranId: z.string().min(2),
})

export type AdminMasterKelasCreateFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyUserValue: AdminMasterKelasCreateFormType = {
  nama: '',
  tahunAjaranId: '',
}

export function translateRawToFormData(data: Kelas & { tahunAjaran: TahunAjaran }): AdminMasterKelasCreateFormType {
  return {
    nama: data.nama ?? '',
    tahunAjaranId: data.tahunAjaran.id,
  }
}
