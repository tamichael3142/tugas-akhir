import { zodResolver } from '@hookform/resolvers/zod'
import { Ekstrakulikuler } from '@prisma/client'
import * as z from 'zod'

export const validaionSchema = z.object({
  nama: z.string().min(2),
  tahunAjaranId: z.string().min(2),
  pengajarId: z.string(),
  ruangan: z.string(),
})

export type AdminMasterEkstrakulikulerCreateFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyUserValue: AdminMasterEkstrakulikulerCreateFormType = {
  nama: '',
  tahunAjaranId: '',
  pengajarId: '',
  ruangan: '',
}

export function translateRawToFormData(data: Ekstrakulikuler): AdminMasterEkstrakulikulerCreateFormType {
  return {
    nama: data.nama ?? '',
    tahunAjaranId: data.tahunAjaranId,
    pengajarId: data.pengajarId ?? '',
    ruangan: data.ruangan ?? '',
  }
}
