import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { SiswaPerKelasDanSemester } from '@prisma/client'

export const validationSchema = z.object({
  siswaPerKelasDanSemesterIds: z.array(z.number()),
})

export type AdminMasterKelasDeleteSiswaFormType = {
  siswaPerKelasDanSemesterIds: SiswaPerKelasDanSemester['id'][]
}

export const resolver = zodResolver(validationSchema)

export const emptyValues: AdminMasterKelasDeleteSiswaFormType = {
  siswaPerKelasDanSemesterIds: [],
}
