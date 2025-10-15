import { useActionData, useFetcher, useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { BackButton, Card } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { AdminMasterTahunAjaranCreateFormType, resolver, emptyUserValue } from './form'
import { ActionDataAdminMasterTahunAjaranCreate } from '~/types/actions-data/admin'
import toast from 'react-hot-toast'
import AdminMasterTahunAjaranFormComponent from '../form-component'

const sectionPrefix = 'admin-master-tahunAjaran-create'

export default function AdminMasterTahunAjaranCreatePage() {
  const actionData = useActionData<ActionDataAdminMasterTahunAjaranCreate>()
  const navigate = useNavigate()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<AdminMasterTahunAjaranCreateFormType>({
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
      navigate(AppNav.admin.masterTahunAjaran())
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  return (
    <AdminPageContainer
      title='Create Tahun Ajaran'
      actions={[<BackButton key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterTahunAjaran()} />]}
    >
      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <Card className=''>
          <p className='font-semibold text-lg'>Tambah Tahun Ajaran</p>
          <hr className='my-4' />

          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <AdminMasterTahunAjaranFormComponent />
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
