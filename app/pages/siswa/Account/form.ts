import { zodResolver } from '@hookform/resolvers/zod'
import { Akun } from '@prisma/client'
import * as z from 'zod'
import { GolonganDarah, Kewarganegaraan } from '~/database/enums/prisma.enums'

export const validaionSchema = z.object({
  tempatLahir: z.string(),
  email: z.email(),
  agama: z.string(),
  alamat: z.string(),
  golonganDarah: z.enum(Object.values(GolonganDarah)),
  kewarganegaraan: z.enum(Object.values(Kewarganegaraan)),
})

export type SiswaAccountSelfUpdateFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyUserValue: SiswaAccountSelfUpdateFormType = {
  tempatLahir: '',
  email: '',
  agama: '',
  alamat: '',
  golonganDarah: GolonganDarah.UNKNOWN,
  kewarganegaraan: Kewarganegaraan.INDONESIA,
}

export const defaultValues: SiswaAccountSelfUpdateFormType = emptyUserValue

export function translateRawToFormData(data: Akun): SiswaAccountSelfUpdateFormType {
  return {
    tempatLahir: data.tempatLahir ?? '',
    email: data.email ?? '',
    agama: data.agama ?? '',
    alamat: data.alamat ?? '',
    golonganDarah: data.golonganDarah as GolonganDarah,
    kewarganegaraan: data.kewarganegaraan as Kewarganegaraan,
  }
}
