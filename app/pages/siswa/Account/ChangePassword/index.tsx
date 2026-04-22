import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import SiswaPageContainer from '~/layouts/siswa/SiswaPageContainer'
import { LoaderDataSiswaAccountChangePassword } from '~/types/loaders-data/siswa'
import SiswaAccountChangePasswordFormComponent from './form-component'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { SiswaAccountChangePasswordFormType, resolver, defaultValues } from './form'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button } from '~/components/forms'
import { FaSave } from 'react-icons/fa'
import { ActionDataSiswaAccountSelfUpdate } from '~/types/actions-data/siswa'

const sectionPrefix = 'siswa-account-change-password'

export default function SiswaAccountChangePasswordPage() {
  const loader = useLoaderData<LoaderDataSiswaAccountChangePassword>()
  const actionData = useActionData<ActionDataSiswaAccountSelfUpdate>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<SiswaAccountChangePasswordFormType>({
    defaultValues,
    resolver,
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
    <SiswaPageContainer
      title='Ganti Password'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} label='Back' buttonProps={{ color: 'secondary' }} />]}
    >
      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <Card>
          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <SiswaAccountChangePasswordFormComponent />
          </RemixFormProvider>

          <hr className='my-8' />
          <div className='flex flex-row items-center justify-end gap-4'>
            <Button variant='text' color='primary' label='Reset form' buttonProps={{ onClick: resetForm }} />
            <Button
              variant='contained'
              color='secondary'
              startIcon={<FaSave />}
              label='Simpan'
              buttonProps={{ disabled: !formHook.formState.isValid, type: 'submit' }}
            />
          </div>
        </Card>
      </fetcher.Form>
    </SiswaPageContainer>
  )
}
