import { Form, Link } from '@remix-run/react'
import { Button } from '~/components/forms'
import { Card } from '~/components/ui'
import constants from '~/constants'
import AppNav from '~/navigation'

export default function ForgotPasswordPage() {
  return (
    <Form className='flex flex-col justify-center p-8 max-w-xl mx-auto min-h-full max-h-screen overflow-y-auto'>
      <div>
        <h1 className='text-3xl md:text-5xl font-medium mb-8'>Forgot Password</h1>
        <Card>
          <p className='text-justify mb-2'>{`Contact the admin if you want to reset your password using these numbers:`}</p>
          <ul>
            <li className='font-semibold'>* {constants.sbbs.phone}</li>
            <li className='font-semibold'>* {constants.sbbs.whatsapp}</li>
          </ul>
          <div className='max-w-xs mt-6 mx-auto'>
            <Link to={AppNav.auth.login()}>
              <Button label='Back' className='w-full' />
            </Link>
          </div>
        </Card>
      </div>
    </Form>
  )
}
