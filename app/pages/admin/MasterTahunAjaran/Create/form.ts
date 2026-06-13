import { zodResolver } from '@hookform/resolvers/zod'
import { TahunAjaran } from '@prisma/client'
import { addYears, format } from 'date-fns'
import * as z from 'zod'
import constants from '~/constants'
import UrlUtils from '~/utils/url.utils'

export const validationSchema = z.object({
  tahunMulai: z.string(),
  tahunBerakhir: z.string(),
  nama: z.string().min(2),
  academicCalendarEmbedUrl: z
    .string()
    .optional()
    .refine(val => !val || UrlUtils.isValidGoogleCalendarEmbedUrl(val), {
      message: 'Please enter a valid Google Calendar embed URL.',
    }),
})

export type AdminMasterTahunAjaranCreateFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

const thisYear = new Date()
const nextYear = addYears(new Date(), 1)

export const emptyUserValue: AdminMasterTahunAjaranCreateFormType = {
  tahunMulai: format(thisYear, constants.dateFormats.rawDateInput),
  tahunBerakhir: format(nextYear, constants.dateFormats.rawDateInput),
  nama: `${thisYear.getFullYear()}/${nextYear.getFullYear()}`,
  academicCalendarEmbedUrl: '',
}

export function translateRawToFormData(data: TahunAjaran): AdminMasterTahunAjaranCreateFormType {
  return {
    tahunMulai: format(data.tahunMulai ?? new Date(), constants.dateFormats.rawDateInput),
    tahunBerakhir: format(data.tahunBerakhir ?? new Date(), constants.dateFormats.rawDateInput),
    nama: data.nama ?? '',
    academicCalendarEmbedUrl: data.academicCalendarEmbedUrl ?? '',
  }
}
