import { zodResolver } from '@hookform/resolvers/zod'
import { PelanggaranPerKelas } from '@prisma/client'
import * as z from 'zod'

export const validationSchema = z.object({
  siswaId: z.string().min(2),
  kelasId: z.string().min(2),
  poin: z.preprocess(val => {
    if (val === '') return undefined
    return Number(val)
  }, z.number().min(0).optional()),
  remark: z.string().optional().nullish(),
})

export type GuruManageViolationsCreateFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

export const emptyValues: GuruManageViolationsCreateFormType = {
  siswaId: '',
  kelasId: '',
  poin: 0,
  remark: '',
}

export function translateRawToFormData(data: PelanggaranPerKelas): GuruManageViolationsCreateFormType {
  return {
    siswaId: data.siswaId ?? '',
    kelasId: data.kelasId ?? '',
    poin: data.poin ?? 0,
    remark: data.remark ?? '',
  }
}
