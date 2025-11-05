import { zodResolver } from '@hookform/resolvers/zod'
import { MataPelajaran, SemesterAjaran } from '@prisma/client'
import * as z from 'zod'

export const validaionSchema = z.object({
  nama: z.string().min(2),
  tahunAjaranId: z.string().min(2),
  semesterAjaranId: z.string().min(2),
  guruId: z.string(),
})

export type AdminMasterMataPelajaranCreateFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyUserValue: AdminMasterMataPelajaranCreateFormType = {
  nama: '',
  tahunAjaranId: '',
  semesterAjaranId: '',
  guruId: '',
}

export function translateRawToFormData(
  data: MataPelajaran & { semesterAjaran: SemesterAjaran },
): AdminMasterMataPelajaranCreateFormType {
  return {
    nama: data.nama ?? '',
    tahunAjaranId: data.semesterAjaran.tahunAjaranId,
    semesterAjaranId: data.semesterAjaranId,
    guruId: data.guruId ?? '',
  }
}
