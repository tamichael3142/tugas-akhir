import { Akun } from '@prisma/client'
import { BaseActionData } from './base-action'
import { AdminDashboardInsertBulkAkunFormType } from '~/pages/admin/Dashboard/form'
import { AdminMasterAccountInsertAkunFormType } from '~/pages/admin/MasterAccount/form-types'

export type ActionDataAdminIndex = BaseActionData & {
  data: {
    // * Success
    deletedCount?: number
    createdAkuns?: Akun[]
    // * Error
    oldFormData?: AdminDashboardInsertBulkAkunFormType
  }
}

export type ActionDataAdminMasterAccountCreate = BaseActionData & {
  data: {
    // * Success
    createdAkun?: Akun
    // * Error
    oldFormData?: AdminMasterAccountInsertAkunFormType
  }
}
