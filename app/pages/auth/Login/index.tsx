import { Form, Link } from '@remix-run/react'
import { Button, TextInput } from '~/components/forms'
import AuthMainLayout from '~/layouts/auth/AuthMainLayout'
import AppNav from '~/navigation'

export default function LoginPage() {
  return (
    <AuthMainLayout>
      <Form className='flex flex-col justify-center p-8 max-w-xl mx-auto min-h-full max-h-screen overflow-y-auto'>
        <div>
          <h1 className='text-3xl md:text-5xl font-medium mb-8'>Login</h1>
          <TextInput
            label='Username/NIP'
            className='mb-2'
            inputProps={{ id: 'login-username-input', placeholder: 'Masukkan Username/NIP' }}
          />
          <TextInput
            label='Password'
            inputProps={{ id: 'login-password-input', placeholder: 'Masukkan Password', type: 'password' }}
          />
          <div className='max-w-xs mt-10 mx-auto'>
            <Button label='Masuk' className='w-full' buttonProps={{ type: 'submit' }} />
          </div>
          <div className='mt-4 flex flex-row justify-center hover:text-primary'>
            <Link to={AppNav.auth.forgotPassword()}>{'Lupa password?'}</Link>
          </div>
        </div>
      </Form>
    </AuthMainLayout>
  )
}
