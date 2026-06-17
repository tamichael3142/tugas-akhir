import { zodResolver } from '@hookform/resolvers/zod'
import { MataPelajaran, SemesterAjaran } from '@prisma/client'
import * as z from 'zod'

export const validationSchema = z.object({
  nama: z.string().min(2),
  kkm: z.coerce.number().int().min(0).max(100),
  tahunAjaranId: z.string().min(2),
  semesterAjaranId: z.string().min(2),
  guruId: z.string(),
})

export type AdminMasterMataPelajaranCreateFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

export const emptyUserValue: AdminMasterMataPelajaranCreateFormType = {
  nama: '',
  kkm: 75,
  tahunAjaranId: '',
  semesterAjaranId: '',
  guruId: '',
}

export function translateRawToFormData(
  data: MataPelajaran & { semesterAjaran: SemesterAjaran },
): AdminMasterMataPelajaranCreateFormType {
  return {
    nama: data.nama ?? '',
    kkm: data.kkm ?? 75,
    tahunAjaranId: data.semesterAjaran.tahunAjaranId,
    semesterAjaranId: data.semesterAjaranId,
    guruId: data.guruId ?? '',
  }
}
