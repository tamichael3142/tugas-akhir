import { useActionData, useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { BackButton, Card } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { AdminMasterMataPelajaranCreateFormType, resolver, emptyUserValue } from './form'
import { ActionDataAdminMasterMataPelajaranCreate } from '~/types/actions-data/admin'
import toast from 'react-hot-toast'
import AdminMasterMataPelajaranFormComponent from '../form-component'
import { LoaderDataAdminMasterMataPelajaranCreate } from '~/types/loaders-data/admin'

const sectionPrefix = 'admin-master-mata-pelajaran-create'

export default function AdminMasterMataPelajaranCreatePage() {
  const loader = useLoaderData<LoaderDataAdminMasterMataPelajaranCreate>()
  const actionData = useActionData<ActionDataAdminMasterMataPelajaranCreate>()
  const navigate = useNavigate()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<AdminMasterMataPelajaranCreateFormType>({
    defaultValues: emptyUserValue,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    formHook.reset()
  }

  useEffect(() => {
    if (actionData?.success) {
      if (confirm('Lanjut mengisi lagi?')) {
        toast.success(actionData.message ?? '')
      } else {
        resetForm()
        toast.success(actionData.message ?? '')
        navigate(AppNav.admin.masterMataPelajaran())
      }
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  return (
    <AdminPageContainer
      title='Create Mata Pelajaran'
      actions={[<BackButton key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterMataPelajaran()} />]}
    >
      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <Card className=''>
          <p className='font-semibold text-lg'>Tambah Mata Pelajaran</p>
          <hr className='my-4' />

          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <AdminMasterMataPelajaranFormComponent tahunAjarans={loader.tahunAjarans} gurus={loader.gurus} />
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
