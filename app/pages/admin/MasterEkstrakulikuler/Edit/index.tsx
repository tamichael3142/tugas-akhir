import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { ActionDataAdminMasterEkstrakulikulerEdit } from '~/types/actions-data/admin'
import toast from 'react-hot-toast'
import AdminMasterEkstrakulikulerFormComponent from '../form-component'
import { LoaderDataAdminMasterEkstrakulikulerEdit } from '~/types/loaders-data/admin'
import { AdminMasterEkstrakulikulerCreateFormType } from '../form-types'
import { emptyUserValue, resolver, translateRawToFormData } from '../Create/form'

const sectionPrefix = 'admin-master-ekstrakulikuler-edit'

export default function AdminMasterEkstrakulikulerEditPage() {
  const loader = useLoaderData<LoaderDataAdminMasterEkstrakulikulerEdit>()
  const actionData = useActionData<ActionDataAdminMasterEkstrakulikulerEdit>()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form-${loader.ekstrakulikuler?.id}` })
  const revalidator = useRevalidator()

  const formHook = useRemixForm<AdminMasterEkstrakulikulerCreateFormType>({
    defaultValues: emptyUserValue,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    if (loader && loader.ekstrakulikuler) formHook.reset(translateRawToFormData(loader.ekstrakulikuler))
  }

  useEffect(() => {
    if (loader && loader.ekstrakulikuler) resetForm()
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
      title='Edit Ekstrakulikuler'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} to={AppNav.admin.masterEkstrakulikuler()} />]}
    >
      <RemixFormProvider key={`${sectionPrefix}-form-${loader.ekstrakulikuler?.id}`} {...formHook}>
        <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
          <Card className=''>
            <p className='font-semibold text-lg'>Edit Ekstrakulikuler</p>
            <hr className='my-4' />

            <AdminMasterEkstrakulikulerFormComponent tahunAjarans={loader.tahunAjarans} pengajars={loader.pengajars} />
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
