import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Kelas, Akun } from '@prisma/client'

export const validationSchema = z.object({
  kelasId: z.string(),
  semester1Ids: z.array(z.string()),
  semester2Ids: z.array(z.string()),
})

export type AdminMasterKelasAddSiswaFormType = {
  kelasId: string
  semester1Ids: Akun['id'][]
  semester2Ids: Akun['id'][]
}

export const resolver = zodResolver(validationSchema)

export const emptyValues: AdminMasterKelasAddSiswaFormType = {
  kelasId: '',
  semester1Ids: [],
  semester2Ids: [],
}

export function translateRawToFormData(data: Kelas): AdminMasterKelasAddSiswaFormType {
  return {
    kelasId: data.id ?? '',
    semester1Ids: [],
    semester2Ids: [],
  }
}
