import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { SiswaPerEkstrakulikuler } from '@prisma/client'

export const validationSchema = z.object({
  siswaPerEkstrakulikulerIds: z.array(z.number()),
})

export type AdminMasterEkstrakulikulerDeleteSiswaFormType = {
  siswaPerEkstrakulikulerIds: SiswaPerEkstrakulikuler['id'][]
}

export const resolver = zodResolver(validationSchema)

export const emptyValues: AdminMasterEkstrakulikulerDeleteSiswaFormType = {
  siswaPerEkstrakulikulerIds: [],
}
