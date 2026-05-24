import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import OrtuAccountSelfUpdateFormComponent from './form-component'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { OrtuAccountChangePasswordFormType, resolver, defaultValues } from './form'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button } from '~/components/forms'
import { FaSave } from 'react-icons/fa'
import { LoaderDataOrtuAccountChangePassword } from '~/types/loaders-data/ortu'
import { ActionDataOrtuAccountSelfUpdate } from '~/types/actions-data/ortu'
import OrtuPageContainer from '~/layouts/ortu/OrtuPageContainer'

const sectionPrefix = 'ortu-account-change-password'

export default function OrtuAccountChangePasswordPage() {
  const loader = useLoaderData<LoaderDataOrtuAccountChangePassword>()
  const actionData = useActionData<ActionDataOrtuAccountSelfUpdate>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<OrtuAccountChangePasswordFormType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  })

  function resetForm() {
    formHook.reset()
  }

  useEffect(() => {
    resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader.account])

  useEffect(() => {
    if (actionData?.success) {
      resetForm()
      toast.success(actionData.message ?? '')
      revalidator.revalidate()
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  if (revalidator.state === 'loading' || !loader.account) return <LoadingFullScreen />
  return (
    <OrtuPageContainer
      title='Ganti Password'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} label='Back' buttonProps={{ color: 'secondary' }} />]}
    >
      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <Card>
          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <OrtuAccountSelfUpdateFormComponent />
          </RemixFormProvider>

          <hr className='my-8' />
          <div className='flex flex-row items-center justify-end gap-4'>
            <Button variant='text' color='primary' label='Reset form' buttonProps={{ onClick: resetForm }} />
            <Button
              variant='contained'
              color='secondary'
              startIcon={<FaSave />}
              label='Save'
              buttonProps={{ disabled: !formHook.formState.isValid, type: 'submit' }}
            />
          </div>
        </Card>
      </fetcher.Form>
    </OrtuPageContainer>
  )
}
