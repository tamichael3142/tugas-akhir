import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { ActionDataAdminMasterAccountCreate } from '~/types/actions-data/admin'
import toast from 'react-hot-toast'
import AdminMasterAccountFormComponent from '../form-component'
import { LoaderDataAdminMasterAkunEdit } from '~/types/loaders-data/admin'
import { AdminMasterAccountInsertAkunFormType } from '../form-types'
import { emptyUserValue, resolver, translateRawToFormData } from '../Create/form'

const sectionPrefix = 'admin-master-account-edit'

export default function AdminMasterAccountEditPage() {
  const loader = useLoaderData<LoaderDataAdminMasterAkunEdit>()
  const actionData = useActionData<ActionDataAdminMasterAccountCreate>()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form-${loader.akun?.id}` })
  const revalidator = useRevalidator()

  const formHook = useRemixForm<AdminMasterAccountInsertAkunFormType>({
    defaultValues: emptyUserValue,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    if (loader && loader.akun) formHook.reset(translateRawToFormData(loader.akun))
  }

  useEffect(() => {
    if (loader && loader.akun) resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader])

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

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <AdminPageContainer
      title='Edit Account'
      actions={[<BackButton key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterAccount()} />]}
    >
      <RemixFormProvider key={`${sectionPrefix}-form-${loader.akun?.id}`} {...formHook}>
        <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
          <Card className=''>
            <p className='font-semibold text-lg'>Edit Akun</p>
            <hr className='my-4' />

            <AdminMasterAccountFormComponent dontTriggerSetNewUsername />
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
      </RemixFormProvider>
    </AdminPageContainer>
  )
}
