import { zodResolver } from '@hookform/resolvers/zod'
import { TahunAjaran } from '@prisma/client'
import * as z from 'zod'

export const validaionSchema = z.object({
  nama: z.string().min(2),
})

export type AdminMasterTahunAjaranCreateFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyUserValue: AdminMasterTahunAjaranCreateFormType = {
  nama: '',
}

export function translateRawToFormData(data: TahunAjaran): AdminMasterTahunAjaranCreateFormType {
  return {
    nama: data.nama ?? '',
  }
}
