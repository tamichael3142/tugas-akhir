import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

export const validaionSchema = z
  .object({
    password: z.string().min(2),
    passwordVerification: z.string(),
  })
  .refine(data => data.password === data.passwordVerification, {
    message: 'Password dan konfirmasi password harus sama!',
    path: ['passwordVerification'],
  })

export type SiswaAccountChangePasswordFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyUserValue: SiswaAccountChangePasswordFormType = {
  password: '',
  passwordVerification: '',
}

export const defaultValues: SiswaAccountChangePasswordFormType = emptyUserValue
