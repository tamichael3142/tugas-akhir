import { zodResolver } from '@hookform/resolvers/zod'
import { AcademicCalendarEvent } from '@prisma/client'
import { format } from 'date-fns'
import * as z from 'zod'
import constants from '~/constants'

const baseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
})

export type AcademicCalendarEventFormType = z.infer<typeof baseSchema>

export function createValidationSchema(tahunMulai: string, tahunBerakhir: string) {
  return baseSchema
    .refine(data => data.startDate >= tahunMulai, {
      message: 'Start date must be within the academic year range',
      path: ['startDate'],
    })
    .refine(data => data.startDate <= data.endDate, {
      message: 'Start date must be on or before end date',
      path: ['startDate'],
    })
    .refine(data => data.endDate >= data.startDate, {
      message: 'End date must be on or after start date',
      path: ['endDate'],
    })
    .refine(data => data.endDate <= tahunBerakhir, {
      message: 'End date must be within the academic year range',
      path: ['endDate'],
    })
}

export function createResolver(tahunMulai: string, tahunBerakhir: string) {
  return zodResolver(createValidationSchema(tahunMulai, tahunBerakhir))
}

const today = format(new Date(), constants.dateFormats.rawDateInput)

export const emptyFormValue: AcademicCalendarEventFormType = {
  title: '',
  description: '',
  startDate: today,
  endDate: today,
}

export function translateRawToFormData(data: AcademicCalendarEvent): AcademicCalendarEventFormType {
  return {
    title: data.title,
    description: data.description ?? '',
    startDate: format(data.startDate, constants.dateFormats.rawDateInput),
    endDate: format(data.endDate, constants.dateFormats.rawDateInput),
  }
}
