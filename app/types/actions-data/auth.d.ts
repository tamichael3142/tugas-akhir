import { Akun } from '@prisma/client'
import { BaseActionData } from './base-action'
import { AuthLoginFormType } from '~/pages/auth/Login/form'

export type ActionDataAuthLogin = BaseActionData & {
  data: {
    // * Success
    user?: Akun
    // * Error
    oldFormData?: AuthLoginFormType
  }
}
