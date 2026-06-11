import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Akun, Ekstrakulikuler } from '@prisma/client'

export const validationSchema = z.object({
  ekstrakulikulerId: z.string(),
  siswaIds: z.array(z.string()),
})

export type AdminMasterEkstrakulikulerAddSiswaFormType = {
  ekstrakulikulerId: Ekstrakulikuler['id']
  siswaIds: Akun['id'][]
}

export const resolver = zodResolver(validationSchema)

export const emptyValues: AdminMasterEkstrakulikulerAddSiswaFormType = {
  ekstrakulikulerId: '',
  siswaIds: [],
}
