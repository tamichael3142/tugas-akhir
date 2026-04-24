import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import DBHelpers from '~/database/helpers'

export const validationSchema = z.object({
  usernameOrNIP: z.string().min(DBHelpers.akun.normalUsernameLength),
  password: z.string().min(2),
})

export type AuthLoginFormType = z.infer<typeof validationSchema>

export const authLoginResolver = zodResolver(validationSchema)

export const emptyUserValue: AuthLoginFormType = {
  usernameOrNIP: '',
  password: '',
}
