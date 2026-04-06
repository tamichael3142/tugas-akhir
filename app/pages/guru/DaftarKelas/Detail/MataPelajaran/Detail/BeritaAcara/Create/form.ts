import { zodResolver } from '@hookform/resolvers/zod'
import { MataPelajaranBeritaAcara } from '@prisma/client'
import { format } from 'date-fns'
import * as z from 'zod'
import constants from '~/constants'

export const validaionSchema = z.object({
  title: z.string().min(2),
  remark: z.string(),
  dayId: z.string(),
  hourStartId: z.string(),
  hourEndId: z.string(),
})

export type GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraCreateFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export function generateTitle({ date, kelasName, mapelName }: { date: Date; kelasName: string; mapelName: string }) {
  return `Berita Acara (${format(date, constants.dateFormats.dateMonthYearSimple)}) ${kelasName} - ${mapelName}`
}

export const emptyValues: GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraCreateFormType = {
  title: '',
  remark: '',
  dayId: 'SENIN',
  hourStartId: '07:45',
  hourEndId: '07:45',
}

export function translateRawToFormData(
  data: MataPelajaranBeritaAcara,
): GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraCreateFormType {
  return {
    title: data.title ?? '',
    remark: data.remark ?? '',
    dayId: data.dayId ?? '',
    hourStartId: data.hourStartId ?? '',
    hourEndId: data.hourEndId ?? '',
  }
}
