import { AssignmentSubmission } from '@prisma/client'
import { BaseActionData } from './base-action'

export type ActionDataSiswaKelasDetailMataPelajaranDetailAssignmentSubmission = BaseActionData & {
  data: {
    // * Success
    updatedAssignmentSubmission?: AssignmentSubmission
    // * Error
    oldFormData?: SiswaKelasDetailMataPelajaranDetailAssignmentSubmissionFormType
  }
}
