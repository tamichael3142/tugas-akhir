import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

export const validationSchema = z.object({
  descriptions: z.array(
    z.object({
      id: z.string().nullable(),
      siswaId: z.string(),
      semesterAjaranId: z.string(),
      mataPelajaranId: z.string(),
      description: z.string().optional(),
    }),
  ),
})

export type GuruReportDescriptionsFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

export const emptyValues: GuruReportDescriptionsFormType = {
  descriptions: [],
}
