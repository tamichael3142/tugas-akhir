import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { ActionDataAdminMasterMataPelajaranEdit } from '~/types/actions-data/admin'
import toast from 'react-hot-toast'
import AdminMasterMataPelajaranFormComponent from '../form-component'
import { LoaderDataAdminMasterMataPelajaranEdit } from '~/types/loaders-data/admin'
import { AdminMasterMataPelajaranCreateFormType } from '../form-types'
import { emptyUserValue, resolver, translateRawToFormData } from '../Create/form'

const sectionPrefix = 'admin-master-mata-pelajaran-edit'

export default function AdminMasterMataPelajaranEditPage() {
  const loader = useLoaderData<LoaderDataAdminMasterMataPelajaranEdit>()
  const actionData = useActionData<ActionDataAdminMasterMataPelajaranEdit>()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form-${loader.mataPelajaran?.id}` })
  const revalidator = useRevalidator()

  const formHook = useRemixForm<AdminMasterMataPelajaranCreateFormType>({
    defaultValues: emptyUserValue,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    if (loader && loader.mataPelajaran) formHook.reset(translateRawToFormData(loader.mataPelajaran))
  }

  useEffect(() => {
    if (loader && loader.mataPelajaran) resetForm()
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
      title='Edit Mata Pelajaran'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} to={AppNav.admin.masterMataPelajaran()} />]}
    >
      <RemixFormProvider key={`${sectionPrefix}-form-${loader.mataPelajaran?.id}`} {...formHook}>
        <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
          <Card className=''>
            <p className='font-semibold text-lg'>Edit Mata Pelajaran</p>
            <hr className='my-4' />

            <AdminMasterMataPelajaranFormComponent tahunAjarans={loader.tahunAjarans} gurus={loader.gurus} />
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
