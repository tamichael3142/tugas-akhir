import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { ActionDataAdminMasterTahunAjaranEdit } from '~/types/actions-data/admin'
import toast from 'react-hot-toast'
import AdminMasterTahunAjaranFormComponent from '../form-component'
import { LoaderDataAdminMasterTahunAjaranEdit } from '~/types/loaders-data/admin'
import { AdminMasterTahunAjaranCreateFormType } from '../form-types'
import { emptyUserValue, resolver, translateRawToFormData } from '../Create/form'

const sectionPrefix = 'admin-master-tahunAjaran-edit'

export default function AdminMasterTahunAjaranEditPage() {
  const loader = useLoaderData<LoaderDataAdminMasterTahunAjaranEdit>()
  const actionData = useActionData<ActionDataAdminMasterTahunAjaranEdit>()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form-${loader.tahunAjaran?.id}` })
  const revalidator = useRevalidator()

  const formHook = useRemixForm<AdminMasterTahunAjaranCreateFormType>({
    defaultValues: emptyUserValue,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    if (loader && loader.tahunAjaran) formHook.reset(translateRawToFormData(loader.tahunAjaran))
  }

  useEffect(() => {
    if (loader && loader.tahunAjaran) resetForm()
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
      title='Edit Tahun Ajaran'
      actions={[<BackButton key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterTahunAjaran()} />]}
    >
      <RemixFormProvider key={`${sectionPrefix}-form-${loader.tahunAjaran?.id}`} {...formHook}>
        <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
          <Card className=''>
            <p className='font-semibold text-lg'>Edit Tahun Ajaran</p>
            <hr className='my-4' />

            <AdminMasterTahunAjaranFormComponent />
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
