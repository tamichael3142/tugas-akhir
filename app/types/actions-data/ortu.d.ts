import { OrtuAccountSelfUpdateFormType } from '~/pages/ortu/Account/form'
import { BaseActionData } from './base-action'
import { OrtuAccountChangePasswordFormType } from '~/pages/ortu/Account/ChangePassword/form'

/**
 * * Account
 */
export type ActionDataOrtuAccountSelfUpdate = BaseActionData & {
  data: {
    // * Error
    oldFormData?: OrtuAccountSelfUpdateFormType
  }
}

export type ActionDataOrtuAccountChangePassword = BaseActionData & {
  data: {
    // * Error
    oldFormData?: OrtuAccountChangePasswordFormType
  }
}
