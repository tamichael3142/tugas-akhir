import { Akun } from '@prisma/client'
import { BaseActionData } from './base-action'
import { FormType } from '~/pages/admin/Dashboard/form'

export type ActionDataAdminIndex = BaseActionData & {
  data: {
    // * Success
    deletedCount?: number
    createdAkuns?: Akun[]
    // * Error
    oldFormData?: FormType
  }
}
