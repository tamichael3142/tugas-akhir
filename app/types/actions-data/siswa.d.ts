import { AssignmentSubmission } from '@prisma/client'
import { BaseActionData } from './base-action'
import { SiswaAccountSelfUpdateFormType } from '~/pages/siswa/Account/form'
import { SiswaAccountChangePasswordFormType } from '~/pages/siswa/Account/ChangePassword/form'

export type ActionDataSiswaKelasDetailMataPelajaranDetailAssignmentSubmission = BaseActionData & {
  data: {
    // * Success
    updatedAssignmentSubmission?: AssignmentSubmission
    // * Error
    oldFormData?: object
  }
}

/**
 * * Account
 */
export type ActionDataSiswaAccountSelfUpdate = BaseActionData & {
  data: {
    // * Error
    oldFormData?: SiswaAccountSelfUpdateFormType
  }
}

export type ActionDataSiswaAccountChangePassword = BaseActionData & {
  data: {
    // * Error
    oldFormData?: SiswaAccountChangePasswordFormType
  }
}
