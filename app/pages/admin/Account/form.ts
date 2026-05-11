import { zodResolver } from '@hookform/resolvers/zod'
import { Akun } from '@prisma/client'
import * as z from 'zod'
import { GolonganDarah, Kewarganegaraan } from '~/database/enums/prisma.enums'

export const validationSchema = z.object({
  tempatLahir: z.string(),
  email: z.email(),
  agama: z.string(),
  alamat: z.string(),
  golonganDarah: z.enum(Object.values(GolonganDarah)),
  kewarganegaraan: z.enum(Object.values(Kewarganegaraan)),
})

export type AdminAccountSelfUpdateFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

export const emptyUserValue: AdminAccountSelfUpdateFormType = {
  tempatLahir: '',
  email: '',
  agama: '',
  alamat: '',
  golonganDarah: GolonganDarah.UNKNOWN,
  kewarganegaraan: Kewarganegaraan.INDONESIA,
}

export const defaultValues: AdminAccountSelfUpdateFormType = emptyUserValue

export function translateRawToFormData(data: Akun): AdminAccountSelfUpdateFormType {
  return {
    tempatLahir: data.tempatLahir ?? '',
    email: data.email ?? '',
    agama: data.agama ?? '',
    alamat: data.alamat ?? '',
    golonganDarah: data.golonganDarah as GolonganDarah,
    kewarganegaraan: data.kewarganegaraan as Kewarganegaraan,
  }
}
