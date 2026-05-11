import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

export const validationSchema = z
  .object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    passwordVerification: z.string(),
  })
  .refine(data => data.password === data.passwordVerification, {
    message: 'Password dan konfirmasi password harus sama!',
    path: ['passwordVerification'],
  })

export type AdminAccountChangePasswordFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

export const emptyUserValue: AdminAccountChangePasswordFormType = {
  password: '',
  passwordVerification: '',
}

export const defaultValues: AdminAccountChangePasswordFormType = emptyUserValue
