import { zodResolver } from '@hookform/resolvers/zod'
import { TahunAjaran } from '@prisma/client'
import { addYears, format } from 'date-fns'
import * as z from 'zod'
import constants from '~/constants'

export const validaionSchema = z.object({
  tahunMulai: z.string(),
  tahunBerakhir: z.string(),
  nama: z.string().min(2),
})

export type AdminMasterTahunAjaranCreateFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

const thisYear = new Date()
const nextYear = addYears(new Date(), 1)

export const emptyUserValue: AdminMasterTahunAjaranCreateFormType = {
  tahunMulai: format(thisYear, constants.dateFormats.rawDateInput),
  tahunBerakhir: format(nextYear, constants.dateFormats.rawDateInput),
  nama: `${thisYear.getFullYear()}/${nextYear.getFullYear()}`,
}

export function translateRawToFormData(data: TahunAjaran): AdminMasterTahunAjaranCreateFormType {
  return {
    tahunMulai: format(data.tahunMulai ?? new Date(), constants.dateFormats.rawDateInput),
    tahunBerakhir: format(data.tahunBerakhir ?? new Date(), constants.dateFormats.rawDateInput),
    nama: data.nama ?? '',
  }
}
