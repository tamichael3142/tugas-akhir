import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { GolonganDarah, JenisKelamin, Kewarganegaraan, Role } from '~/database/enums/prisma.enums'
import DBHelpers from '~/database/helpers'

export const validaionSchema = z.object({
  deletedTempAkunIds: z.array(z.string()),
  newUsers: z.array(
    z.object({
      tempAkunId: z.string().nullish(),
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      tempatLahir: z.string().nullish(),
      tanggalLahir: z.string().nullish(),
      role: z.enum(Object.values(Role)),
      username: z.string().min(2),
      password: z.string().min(2),
      email: z.email().nullish(),
      jenisKelamin: z.enum(Object.values(JenisKelamin)),
      agama: z.string().nullish(),
      alamat: z.string().nullish(),
      golonganDarah: z.enum(Object.values(GolonganDarah)),
      kewarganegaraan: z.enum(Object.values(Kewarganegaraan)),
    }),
  ),
})

export type AdminDashboardInsertBulkAkunFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyUserValue: AdminDashboardInsertBulkAkunFormType['newUsers'][0] = {
  tempAkunId: null,
  firstName: '',
  lastName: '',
  tempatLahir: null,
  tanggalLahir: null,
  role: Role.SISWA,
  username: '',
  password: '',
  email: null,
  jenisKelamin: JenisKelamin.UNKNOWN,
  agama: null,
  alamat: null,
  golonganDarah: GolonganDarah.UNKNOWN,
  kewarganegaraan: Kewarganegaraan.INDONESIA,
}

export function getDummyUserValue(): AdminDashboardInsertBulkAkunFormType['newUsers'][0] {
  const firstName = 'Michael'
  const lastName = 'Zefanya'
  const tanggalLahir = '2001-04-21'
  const username = DBHelpers.akun.generateUsername({ firstName, lastName, tanggalLahir: new Date(tanggalLahir) })

  return {
    tempAkunId: null,
    firstName,
    lastName,
    tempatLahir: 'Surabaya',
    tanggalLahir,
    role: Role.SISWA,
    username,
    password: username,
    email: 'tamichael3142@gmail.com',
    jenisKelamin: JenisKelamin.MALE,
    agama: null,
    alamat: null,
    golonganDarah: GolonganDarah.UNKNOWN,
    kewarganegaraan: Kewarganegaraan.INDONESIA,
  }
}

export const defaultValues: AdminDashboardInsertBulkAkunFormType = {
  deletedTempAkunIds: [],
  newUsers: [],
}
