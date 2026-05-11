import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import AdminAccountSelfUpdateFormComponent from './form-component'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { AdminAccountSelfUpdateFormType, resolver, defaultValues, translateRawToFormData } from './form'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button } from '~/components/forms'
import { FaSave } from 'react-icons/fa'
import AdminAccountSelfUpdateDetailComponent from './detail-component'
import { LoaderDataAdminAccount } from '~/types/loaders-data/admin'
import { ActionDataAdminAccountSelfUpdate } from '~/types/actions-data/admin'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'

const sectionPrefix = 'admin-account'

export default function AdminAccountPage() {
  const loader = useLoaderData<LoaderDataAdminAccount>()
  const actionData = useActionData<ActionDataAdminAccountSelfUpdate>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<AdminAccountSelfUpdateFormType>({
    defaultValues,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    formHook.reset()
  }

  useEffect(() => {
    formHook.reset(translateRawToFormData(loader.account))
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
    <AdminPageContainer
      title='Atur Akun'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} label='Back' buttonProps={{ color: 'primary' }} />]}
    >
      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <Card>
          <p className='font-semibold text-lg'>Permanent Data</p>
          <hr className='my-4' />
          <AdminAccountSelfUpdateDetailComponent account={loader.account} />

          <p className='font-semibold text-lg'>Edit Info</p>
          <hr className='my-4' />
          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <AdminAccountSelfUpdateFormComponent account={loader.account} />
          </RemixFormProvider>

          <hr className='my-8' />
          <div className='flex flex-row items-center justify-end gap-4'>
            <Button variant='text' color='secondary' label='Reset form' buttonProps={{ onClick: resetForm }} />
            <Button
              variant='contained'
              color='primary'
              startIcon={<FaSave />}
              label='Simpan'
              buttonProps={{ type: 'submit' }}
            />
          </div>
        </Card>
      </fetcher.Form>
    </AdminPageContainer>
  )
}
