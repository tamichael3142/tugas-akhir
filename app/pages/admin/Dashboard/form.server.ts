import { zodResolver } from '@hookform/resolvers/zod'
import { $Enums } from '@prisma/client'
import * as z from 'zod'
import * as dateFns from 'date-fns'

export const validaionSchema = z.object({
  newUsers: z.array(
    z.object({
      tempAkunId: z.string().nullish(),
      displayName: z.string().min(2),
      tempatLahir: z.string().nullish(),
      tanggalLahir: z.string().nullish(),
      role: z.enum(Object.values($Enums.Role)),
      username: z.string().min(2),
      password: z.string().min(2),
      email: z.email().nullish(),
      gender: z.enum(Object.values($Enums.JenisKelamin)),
      agama: z.string().nullish(),
      alamat: z.string().nullish(),
      golDarah: z.enum(Object.values($Enums.GolonganDarah)),
      kewarganegaraan: z.enum(Object.values($Enums.Kewarganegaraan)),
    }),
  ),
})

export type FormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyUserValue: FormType['newUsers'][0] = {
  tempAkunId: null,
  displayName: '',
  tempatLahir: null,
  tanggalLahir: null,
  role: $Enums.Role.SISWA,
  username: '',
  password: '',
  email: null,
  gender: $Enums.JenisKelamin.UNKNOWN,
  agama: null,
  alamat: null,
  golDarah: $Enums.GolonganDarah.UNKNOWN,
  kewarganegaraan: $Enums.Kewarganegaraan.INDONESIA,
}

export function getDummyUserValue(): FormType['newUsers'][0] {
  return {
    tempAkunId: null,
    displayName: 'Michael',
    tempatLahir: 'Surabaya',
    tanggalLahir: '2001-04-21',
    role: $Enums.Role.SISWA,
    username: 'michael-' + dateFns.getTime(new Date()),
    password: 'michael3142',
    email: 'tamichael3142@gmail.com',
    gender: $Enums.JenisKelamin.MALE,
    agama: null,
    alamat: null,
    golDarah: $Enums.GolonganDarah.UNKNOWN,
    kewarganegaraan: $Enums.Kewarganegaraan.INDONESIA,
  }
}
