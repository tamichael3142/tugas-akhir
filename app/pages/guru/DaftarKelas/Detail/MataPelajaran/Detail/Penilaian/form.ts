import { zodResolver } from '@hookform/resolvers/zod'
import { Penilaian } from '@prisma/client'
import * as z from 'zod'

export const validaionSchema = z.object({
  penilaians: z.array(
    z.object({
      id: z.number().nullable(),
      kelasId: z.string(),
      mataPelajaranId: z.string(),
      kompetensiId: z.string(),
      siswaId: z.string(),
      nilai: z.preprocess(val => {
        if (val === '') return undefined
        return Number(val)
      }, z.number().min(0, 'Minimal 0').max(100, 'Maksimal 100').optional()),
    }),
  ),
})

export type GuruDaftarKelasDetailMataPelajaranDetailPenilaianFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyValues: GuruDaftarKelasDetailMataPelajaranDetailPenilaianFormType = {
  penilaians: [],
}

export function translateRawToFormData(
  penilaians: Penilaian[],
): GuruDaftarKelasDetailMataPelajaranDetailPenilaianFormType {
  return {
    penilaians: [
      ...penilaians.map(item => ({
        id: item.id ?? null,
        kelasId: item.kelasId,
        mataPelajaranId: item.mataPelajaranId,
        kompetensiId: item.kompetensiId,
        siswaId: item.siswaId,
        nilai: Number(item.nilai) ?? 0,
      })),
    ],
  }
}
