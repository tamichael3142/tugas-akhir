import { zodResolver } from '@hookform/resolvers/zod'
import { Assignment } from '@prisma/client'
import { format } from 'date-fns'
import * as z from 'zod'
import constants from '~/constants'
import { AssignmentSubmissionType } from '~/database/enums/prisma.enums'

export const validaionSchema = z.object({
  title: z.string().min(2),
  description: z.string(),
  tanggalMulai: z.string(),
  tanggalBerakhir: z.string(),
  isSubmitable: z.boolean(),
  submissionType: z.enum(Object.values(AssignmentSubmissionType)),
})

export type GuruDaftarKelasDetailMataPelajaranDetailAssignmentCreateFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyValues: GuruDaftarKelasDetailMataPelajaranDetailAssignmentCreateFormType = {
  title: '',
  description: '',
  tanggalMulai: format(new Date(), constants.dateFormats.rawDateTimeInput),
  tanggalBerakhir: format(new Date(), constants.dateFormats.rawDateTimeInput),
  isSubmitable: false,
  submissionType: AssignmentSubmissionType.FILE_UPLOAD,
}

export function translateRawToFormData(
  data: Assignment,
): GuruDaftarKelasDetailMataPelajaranDetailAssignmentCreateFormType {
  return {
    title: data.title ?? '',
    description: data.description ?? '',
    tanggalMulai: format(data.tanggalMulai ?? new Date(), constants.dateFormats.rawDateTimeInput),
    tanggalBerakhir: format(data.tanggalBerakhir ?? new Date(), constants.dateFormats.rawDateTimeInput),
    isSubmitable: data.isSubmitable ?? false,
    submissionType: data.submissionType
      ? (data.submissionType as AssignmentSubmissionType)
      : AssignmentSubmissionType.FILE_UPLOAD,
  }
}
