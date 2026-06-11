import { zodResolver } from '@hookform/resolvers/zod'
import { PenilaianExtrakulikuler } from '@prisma/client'
import * as z from 'zod'

export const validationSchema = z.object({
  penilaians: z.array(
    z.object({
      id: z.number().nullable(),
      ekstrakulikulerId: z.string(),
      kompetensiEkstrakulikulerId: z.string(),
      siswaId: z.string(),
      nilai: z.preprocess(val => {
        if (val === '') return undefined
        return Number(val)
      }, z.number().min(0, 'Minimal 0').max(100, 'Maksimal 100').optional()),
    }),
  ),
})

export type GuruManageEkstrakulikulerDetailAssessmentFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

export const emptyValues: GuruManageEkstrakulikulerDetailAssessmentFormType = {
  penilaians: [],
}

export function translateRawToFormData(
  penilaians: PenilaianExtrakulikuler[],
): GuruManageEkstrakulikulerDetailAssessmentFormType {
  return {
    penilaians: [
      ...penilaians.map(item => ({
        id: item.id ?? null,
        ekstrakulikulerId: item.ekstrakulikulerId,
        kompetensiEkstrakulikulerId: item.kompetensiEkstrakulikulerId,
        siswaId: item.siswaId,
        nilai: Number(item.nilai) ?? 0,
      })),
    ],
  }
}
