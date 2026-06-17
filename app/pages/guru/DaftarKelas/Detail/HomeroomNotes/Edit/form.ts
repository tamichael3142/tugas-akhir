import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

export const validationSchema = z.object({
  siswaId: z.string().min(1),
  semesterAjaranId: z.string().min(1),
  homeroomTeacherNote: z.string().optional(),
})

export type GuruHomeroomNoteEditFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

export const emptyValues: GuruHomeroomNoteEditFormType = {
  siswaId: '',
  semesterAjaranId: '',
  homeroomTeacherNote: '',
}
