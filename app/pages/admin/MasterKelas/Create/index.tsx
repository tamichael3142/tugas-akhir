import { useActionData, useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { BackButton, Card } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { AdminMasterKelasCreateFormType, resolver, emptyUserValue } from './form'
import { ActionDataAdminMasterKelasCreate } from '~/types/actions-data/admin'
import toast from 'react-hot-toast'
import AdminMasterKelasFormComponent from '../form-component'
import { LoaderDataAdminMasterKelasCreate } from '~/types/loaders-data/admin'

const sectionPrefix = 'admin-master-kelas-create'

export default function AdminMasterKelasCreatePage() {
  const loader = useLoaderData<LoaderDataAdminMasterKelasCreate>()
  const actionData = useActionData<ActionDataAdminMasterKelasCreate>()
  const navigate = useNavigate()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<AdminMasterKelasCreateFormType>({
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
      navigate(AppNav.admin.masterKelas())
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  return (
    <AdminPageContainer
      title='Create Kelas'
      actions={[<BackButton key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterKelas()} />]}
    >
      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <Card className=''>
          <p className='font-semibold text-lg'>Tambah Kelas</p>
          <hr className='my-4' />

          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <AdminMasterKelasFormComponent tahunAjarans={loader.tahunAjarans} />
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
