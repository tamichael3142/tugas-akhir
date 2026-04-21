import { AssignmentSubmission } from '@prisma/client'
import { BaseActionData } from './base-action'
import { SiswaAccountSelfUpdateFormType } from '~/pages/siswa/Account/form'

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
