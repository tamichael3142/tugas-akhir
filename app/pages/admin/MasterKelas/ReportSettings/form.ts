import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ReportStatus } from '~/database/enums/prisma.enums'

export const validationSchema = z.object({
  status: z.nativeEnum(ReportStatus),
})

export type AdminMasterKelasReportSettingsFormType = {
  status: ReportStatus
}

export const resolver = zodResolver(validationSchema)

export const emptyValues: AdminMasterKelasReportSettingsFormType = {
  status: ReportStatus.DRAFT,
}
