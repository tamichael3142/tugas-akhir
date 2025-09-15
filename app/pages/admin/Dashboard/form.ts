import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import * as dateFns from 'date-fns'
import { GolonganDarah, JenisKelamin, Kewarganegaraan, Role } from '~/enums/prisma.enums'

export const validaionSchema = z.object({
  newUsers: z.array(
    z.object({
      tempAkunId: z.string().nullish(),
      displayName: z.string().min(2),
      tempatLahir: z.string().nullish(),
      tanggalLahir: z.string().nullish(),
      role: z.enum(Object.values(Role)),
      username: z.string().min(2),
      password: z.string().min(2),
      email: z.email().nullish(),
      gender: z.enum(Object.values(JenisKelamin)),
      agama: z.string().nullish(),
      alamat: z.string().nullish(),
      golDarah: z.enum(Object.values(GolonganDarah)),
      kewarganegaraan: z.enum(Object.values(Kewarganegaraan)),
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
  role: Role.SISWA,
  username: '',
  password: '',
  email: null,
  gender: JenisKelamin.UNKNOWN,
  agama: null,
  alamat: null,
  golDarah: GolonganDarah.UNKNOWN,
  kewarganegaraan: Kewarganegaraan.INDONESIA,
}

export function getDummyUserValue(): FormType['newUsers'][0] {
  return {
    tempAkunId: null,
    displayName: 'Michael',
    tempatLahir: 'Surabaya',
    tanggalLahir: '2001-04-21',
    role: Role.SISWA,
    username: 'michael-' + dateFns.getTime(new Date()),
    password: 'michael3142',
    email: 'tamichael3142@gmail.com',
    gender: JenisKelamin.MALE,
    agama: null,
    alamat: null,
    golDarah: GolonganDarah.UNKNOWN,
    kewarganegaraan: Kewarganegaraan.INDONESIA,
  }
}
