import { zodResolver } from '@hookform/resolvers/zod'
import { PelanggaranPerKelas } from '@prisma/client'
import * as z from 'zod'

export const validationSchema = z.object({
  siswaId: z.string().min(2),
  poin: z.preprocess(val => {
    if (val === '') return undefined
    return Number(val)
  }, z.number().optional()),
  remark: z.string().optional().nullish(),
})

export type GuruDaftarKelasDetailPelanggaranCreateFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

export const emptyValues: GuruDaftarKelasDetailPelanggaranCreateFormType = {
  siswaId: '',
  poin: 0,
  remark: '',
}

export function translateRawToFormData(data: PelanggaranPerKelas): GuruDaftarKelasDetailPelanggaranCreateFormType {
  return {
    siswaId: data.siswaId ?? '',
    poin: data.poin ?? 0,
    remark: data.remark ?? '',
  }
}
