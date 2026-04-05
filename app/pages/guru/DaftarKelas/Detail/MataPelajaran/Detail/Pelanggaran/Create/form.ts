import { zodResolver } from '@hookform/resolvers/zod'
import { PelanggaranPerMapel } from '@prisma/client'
import * as z from 'zod'

export const validaionSchema = z.object({
  siswaId: z.string().min(2),
  poin: z.preprocess(val => {
    if (val === '') return undefined
    return Number(val)
  }, z.number().optional()),
  remark: z.string().optional().nullish(),
})

export type GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyValues: GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateFormType = {
  siswaId: '',
  poin: 0,
  remark: '',
}

export function translateRawToFormData(
  data: PelanggaranPerMapel,
): GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateFormType {
  return {
    siswaId: data.siswaId ?? '',
    poin: data.poin ?? 0,
    remark: data.remark ?? '',
  }
}
