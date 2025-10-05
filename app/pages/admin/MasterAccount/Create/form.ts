import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { GolonganDarah, JenisKelamin, Kewarganegaraan, Role } from '~/database/enums/prisma.enums'
import DBHelpers from '~/database/helpers'

export const validaionSchema = z.object({
  nip: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  tempatLahir: z.string(),
  tanggalLahir: z.string().nullish(),
  role: z.enum(Object.values(Role)),
  username: z.string().min(2),
  password: z.string().min(2),
  email: z.email(),
  jenisKelamin: z.enum(Object.values(JenisKelamin)),
  agama: z.string(),
  alamat: z.string(),
  golonganDarah: z.enum(Object.values(GolonganDarah)),
  kewarganegaraan: z.enum(Object.values(Kewarganegaraan)),
})

export type AdminMasterAccountInsertAkunFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyUserValue: AdminMasterAccountInsertAkunFormType = {
  nip: '',
  firstName: '',
  lastName: '',
  tempatLahir: '',
  tanggalLahir: null,
  role: Role.SISWA,
  username: '',
  password: '',
  email: '',
  jenisKelamin: JenisKelamin.UNKNOWN,
  agama: '',
  alamat: '',
  golonganDarah: GolonganDarah.UNKNOWN,
  kewarganegaraan: Kewarganegaraan.INDONESIA,
}

export function getDummyUserValue(): AdminMasterAccountInsertAkunFormType {
  const firstName = 'Michael'
  const lastName = 'Zefanya'
  const tanggalLahir = '2001-04-21'
  const username = DBHelpers.akun.generateUsername({ firstName, lastName, tanggalLahir: new Date(tanggalLahir) })

  return {
    nip: '',
    firstName,
    lastName,
    tempatLahir: 'Surabaya',
    tanggalLahir,
    role: Role.SISWA,
    username,
    password: username,
    email: 'tamichael3142@gmail.com',
    jenisKelamin: JenisKelamin.MALE,
    agama: '',
    alamat: '',
    golonganDarah: GolonganDarah.UNKNOWN,
    kewarganegaraan: Kewarganegaraan.INDONESIA,
  }
}

export const defaultValues: AdminMasterAccountInsertAkunFormType =
  process.env.NODE_ENV === 'production' ? emptyUserValue : getDummyUserValue()
