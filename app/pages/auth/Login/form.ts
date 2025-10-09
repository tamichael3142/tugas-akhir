import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import DBHelpers from '~/database/helpers'

export const validaionSchema = z.object({
  usernameOrNIP: z.string().min(DBHelpers.akun.normalUsernameLength),
  password: z.string().min(2),
})

export type AuthLoginFormType = z.infer<typeof validaionSchema>

export const authLoginResolver = zodResolver(validaionSchema)

export const emptyUserValue: AuthLoginFormType = {
  usernameOrNIP: '',
  password: '',
}
