import { useActionData, useNavigate } from '@remix-run/react'
import { Card } from '~/components/ui'
import LAuthSetInitialPasswordFormComponent from './form-component'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { LAuthSetInitialPasswordFormType, resolver, defaultValues } from './form'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button } from '~/components/forms'
import { FaSave } from 'react-icons/fa'
import { BaseActionData } from '~/types/actions-data/base-action'
import AppNav from '~/navigation'

export default function LAuthSetInitialPasswordPage() {
  const actionData = useActionData<BaseActionData>()
  const navigate = useNavigate()

  const formHook = useRemixForm<LAuthSetInitialPasswordFormType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  })

  useEffect(() => {
    if (actionData?.success) {
      formHook.reset()
      toast.success(actionData.message ?? 'Password changed!')
    } else if (actionData?.error) {
      toast.error(actionData.message ?? 'Something is wrong!')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  return (
    <div className='flex flex-col justify-center p-8 max-w-3xl mx-auto min-h-full max-h-screen overflow-y-auto'>
      <div>
        <h1 className='text-3xl md:text-5xl font-medium mb-2'>Set Initial Password</h1>
        <p className='text-gray-500 mb-8'>Please change your password first before continuing.</p>
        <Card>
          <RemixFormProvider key='set-init-pass-form' {...formHook}>
            <form method='post' onSubmit={formHook.handleSubmit}>
              <LAuthSetInitialPasswordFormComponent />
              <hr className='my-8' />
              <div className='flex flex-row items-center justify-end gap-4'>
                <Button
                  variant='text'
                  color='secondary'
                  label='Back'
                  buttonProps={{ onClick: () => navigate(AppNav.auth.logout()) }}
                />
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<FaSave />}
                  label='Save'
                  buttonProps={{ disabled: !formHook.formState.isValid, type: 'submit' }}
                />
              </div>
            </form>
          </RemixFormProvider>
        </Card>
      </div>
    </div>
  )
}
