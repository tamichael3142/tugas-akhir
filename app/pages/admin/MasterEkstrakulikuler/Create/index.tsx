import { useActionData, useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { BackButton, Card } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { AdminMasterEkstrakulikulerCreateFormType, resolver, emptyUserValue } from './form'
import { ActionDataAdminMasterEkstrakulikulerCreate } from '~/types/actions-data/admin'
import toast from 'react-hot-toast'
import AdminMasterEkstrakulikulerFormComponent from '../form-component'
import { LoaderDataAdminMasterEkstrakulikulerCreate } from '~/types/loaders-data/admin'

const sectionPrefix = 'admin-master-ekstrakulikuler-create'

export default function AdminMasterEkstrakulikulerCreatePage() {
  const loader = useLoaderData<LoaderDataAdminMasterEkstrakulikulerCreate>()
  const actionData = useActionData<ActionDataAdminMasterEkstrakulikulerCreate>()
  const navigate = useNavigate()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<AdminMasterEkstrakulikulerCreateFormType>({
    defaultValues: emptyUserValue,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    formHook.reset()
  }

  useEffect(() => {
    if (actionData?.success) {
      resetForm()
      toast.success(actionData.message ?? '')
      navigate(AppNav.admin.masterEkstrakulikuler())
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  return (
    <AdminPageContainer
      title='Create Ekstrakulikuler'
      actions={[<BackButton key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterEkstrakulikuler()} />]}
    >
      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <Card className=''>
          <p className='font-semibold text-lg'>Tambah Ekstrakulikuler</p>
          <hr className='my-4' />

          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <AdminMasterEkstrakulikulerFormComponent tahunAjarans={loader.tahunAjarans} pengajars={loader.pengajars} />
          </RemixFormProvider>
          <hr className='my-8' />
          <div className='flex flex-row items-center justify-end gap-4'>
            <Button variant='text' color='secondary' label='Kosongkan form' buttonProps={{ onClick: resetForm }} />
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
