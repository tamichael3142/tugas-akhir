import { zodResolver } from '@hookform/resolvers/zod'
import { Assignment } from '@prisma/client'
import { format } from 'date-fns'
import * as z from 'zod'
import constants from '~/constants'
import { AssignmentSubmissionAllowedFileType, AssignmentSubmissionType } from '~/database/enums/prisma.enums'
import DateUtils from '~/utils/date.utils'

export const validationSchema = z.object({
  title: z.string().min(2),
  description: z.string(),
  tanggalMulai: z.string(),
  tanggalBerakhir: z.string(),
  isSubmitable: z.boolean(),
  submissionType: z.enum(Object.values(AssignmentSubmissionType)),
  submissionAllowedFileType: z.enum(Object.values(AssignmentSubmissionAllowedFileType)).optional().nullable(),
  connectedKompetensiId: z.string().optional().nullable(),
})

export type GuruDaftarKelasDetailMataPelajaranDetailAssignmentCreateFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

export const emptyValues: GuruDaftarKelasDetailMataPelajaranDetailAssignmentCreateFormType = {
  title: '',
  description: '',
  tanggalMulai: format(new Date(), constants.dateFormats.rawDateTimeInput),
  tanggalBerakhir: format(new Date(), constants.dateFormats.rawDateTimeInput),
  isSubmitable: false,
  submissionType: AssignmentSubmissionType.FILE_UPLOAD,
  submissionAllowedFileType: null,
  connectedKompetensiId: null,
}

export function translateRawToFormData(
  data: Assignment,
): GuruDaftarKelasDetailMataPelajaranDetailAssignmentCreateFormType {
  return {
    title: data.title ?? '',
    description: data.description ?? '',
    tanggalMulai: DateUtils.formatStoredDatetime(
      data.tanggalMulai,
      format(new Date(), constants.dateFormats.rawDateTimeInput),
    ),
    tanggalBerakhir: DateUtils.formatStoredDatetime(
      data.tanggalBerakhir,
      format(new Date(), constants.dateFormats.rawDateTimeInput),
    ),
    isSubmitable: data.isSubmitable ?? false,
    submissionType: data.submissionType
      ? (data.submissionType as AssignmentSubmissionType)
      : AssignmentSubmissionType.FILE_UPLOAD,
    submissionAllowedFileType: data.submissionAllowedFileType
      ? (data.submissionAllowedFileType as AssignmentSubmissionAllowedFileType)
      : null,
    connectedKompetensiId: data.connectedKompetensiId ?? null,
  }
}
