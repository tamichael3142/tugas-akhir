import { zodResolver } from '@hookform/resolvers/zod'
import { Absensi } from '@prisma/client'
import { format } from 'date-fns'
import * as z from 'zod'
import constants from '~/constants'

export const validationSchema = z.object({
  label: z.string().min(2),
  tanggal: z.string(),
  tanggalText: z.string(),
  remarks: z.string().nullish(),
  kelasId: z.string(),
  semesterAjaranId: z.string(),
})

export type GuruManageAbsensiEditFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

export const emptyUserValue: GuruManageAbsensiEditFormType = {
  label: '',
  tanggal: format(new Date(), constants.dateFormats.rawDateInput),
  tanggalText: '',
  remarks: null,
  kelasId: '',
  semesterAjaranId: '',
}

export function translateRawToFormData(data: Absensi): GuruManageAbsensiEditFormType {
  return {
    label: data.label ?? '',
    tanggal: format(data.tanggal ?? new Date(), constants.dateFormats.rawDateInput),
    tanggalText: data.tanggalText ?? '',
    remarks: data.remarks ?? '',
    kelasId: data.kelasId ?? '',
    semesterAjaranId: data.semesterAjaranId ?? '',
  }
}
