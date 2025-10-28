import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { ActionDataAdminMasterKelasEdit } from '~/types/actions-data/admin'
import toast from 'react-hot-toast'
import AdminMasterKelasFormComponent from '../form-component'
import { LoaderDataAdminMasterKelasEdit } from '~/types/loaders-data/admin'
import { AdminMasterKelasCreateFormType } from '../form-types'
import { emptyUserValue, resolver, translateRawToFormData } from '../Create/form'

const sectionPrefix = 'admin-master-kelas-edit'

export default function AdminMasterKelasEditPage() {
  const loader = useLoaderData<LoaderDataAdminMasterKelasEdit>()
  const actionData = useActionData<ActionDataAdminMasterKelasEdit>()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form-${loader.kelas?.id}` })
  const revalidator = useRevalidator()

  const formHook = useRemixForm<AdminMasterKelasCreateFormType>({
    defaultValues: emptyUserValue,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    if (loader && loader.kelas) formHook.reset(translateRawToFormData(loader.kelas))
  }

  useEffect(() => {
    if (loader && loader.kelas) resetForm()
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
      title='Edit Kelas'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} to={AppNav.admin.masterKelas()} />]}
    >
      <RemixFormProvider key={`${sectionPrefix}-form-${loader.kelas?.id}`} {...formHook}>
        <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
          <Card className=''>
            <p className='font-semibold text-lg'>Edit Kelas</p>
            <hr className='my-4' />

            <AdminMasterKelasFormComponent tahunAjarans={loader.tahunAjarans} gurus={loader.gurus} />
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
