import { zodResolver } from '@hookform/resolvers/zod'
import { Kelas } from '@prisma/client'
import * as z from 'zod'

export const validationSchema = z.object({
  kelasId: z.string(),
  jadwalPelajarans: z.array(
    z.object({
      id: z.number().nullable(),
      jadwalPelajaranId: z.string().optional(),
      mataPelajaranId: z.string(),
      semesterAjaranId: z.string(),
      dayId: z.string(),
      hourId: z.string(),
    }),
  ),
})

export type AdminMasterKelasManageJadwalFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

export const emptyValues: AdminMasterKelasManageJadwalFormType = {
  kelasId: '',
  jadwalPelajarans: [],
}

export function translateRawToFormData(data: Kelas): AdminMasterKelasManageJadwalFormType {
  return {
    kelasId: data.id ?? '',
    jadwalPelajarans: [],
  }
}
