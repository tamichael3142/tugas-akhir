import { Form, Link, useActionData } from '@remix-run/react'
import { useRemixForm } from 'remix-hook-form'
import { Button, TextInput } from '~/components/forms'
import AppNav from '~/navigation'
import { AuthLoginFormType, authLoginResolver, emptyUserValue } from './form'
import { ActionDataAuthLogin } from '~/types/actions-data/auth'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Controller } from 'react-hook-form'

export default function LoginPage() {
  const actionData = useActionData<ActionDataAuthLogin>()

  const formHook = useRemixForm<AuthLoginFormType>({
    defaultValues: emptyUserValue,
    mode: 'onChange',
    resolver: authLoginResolver,
  })

  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        toast.success('Login berhasil!')
      } else {
        if (actionData.message) toast.error(actionData.message)
      }
    }
  }, [actionData])

  return (
    <Form
      method='post'
      onSubmit={formHook.handleSubmit}
      className='flex flex-col justify-center p-8 max-w-xl mx-auto min-h-full max-h-screen overflow-y-auto'
    >
      <div>
        <h1 className='text-3xl md:text-5xl font-medium mb-8'>Login</h1>
        <Controller
          control={formHook.control}
          name='usernameOrNIP'
          render={({ field }) => (
            <TextInput
              label='Username/NIP'
              className='mb-2'
              inputProps={{ id: 'login-username-input', placeholder: 'Masukkan Username/NIP', ...field }}
            />
          )}
        />
        <Controller
          control={formHook.control}
          name='password'
          render={({ field }) => (
            <TextInput
              label='Password'
              inputProps={{ id: 'login-password-input', placeholder: 'Masukkan Password', type: 'password', ...field }}
            />
          )}
        />
        <div className='max-w-xs mt-10 mx-auto'>
          <Button label='Masuk' className='w-full' buttonProps={{ type: 'submit' }} />
        </div>
        <div className='mt-4 flex flex-row justify-center hover:text-primary'>
          <Link to={AppNav.auth.forgotPassword()}>{'Lupa password?'}</Link>
        </div>
      </div>
    </Form>
  )
}
