import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import GuruAccountSelfUpdateFormComponent from './form-component'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { GuruAccountChangePasswordFormType, resolver, defaultValues } from './form'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button } from '~/components/forms'
import { FaSave } from 'react-icons/fa'
import { LoaderDataGuruAccountChangePassword } from '~/types/loaders-data/guru'
import { ActionDataGuruAccountSelfUpdate } from '~/types/actions-data/guru'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'

const sectionPrefix = 'guru-account-change-password'

export default function GuruAccountChangePasswordPage() {
  const loader = useLoaderData<LoaderDataGuruAccountChangePassword>()
  const actionData = useActionData<ActionDataGuruAccountSelfUpdate>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<GuruAccountChangePasswordFormType>({
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
    <GuruPageContainer
      title='Ganti Password'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} label='Back' buttonProps={{ color: 'primary' }} />]}
    >
      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <Card>
          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <GuruAccountSelfUpdateFormComponent />
          </RemixFormProvider>

          <hr className='my-8' />
          <div className='flex flex-row items-center justify-end gap-4'>
            <Button variant='text' color='secondary' label='Reset form' buttonProps={{ onClick: resetForm }} />
            <Button
              variant='contained'
              color='primary'
              startIcon={<FaSave />}
              label='Simpan'
              buttonProps={{ disabled: !formHook.formState.isValid, type: 'submit' }}
            />
          </div>
        </Card>
      </fetcher.Form>
    </GuruPageContainer>
  )
}
