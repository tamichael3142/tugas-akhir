import { useActionData, useFetcher, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import { LoaderDataGuruManageMataPelajaranDetailAssignmentEdit } from '~/types/loaders-data/guru'
import GuruManageMataPelajaranDetailTab, { TabKey } from '../../_components/Tab'
import { ActionDataGuruManageMataPelajaranDetailAssignmentEdit } from '~/types/actions-data/guru'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import {
  emptyValues,
  resolver,
  GuruManageMataPelajaranDetailAssignmentCreateFormType,
  translateRawToFormData,
} from '../Create/form'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import AppNav from '~/navigation'
import { Button } from '~/components/forms'
import { FaSave } from 'react-icons/fa'
import AdminManageMataPelajaranDetailAssignmentFormComponent from '../form-component'

const sectionPrefix = 'guru-manage-mata-pelajaran-detail-assignment-edit'

export default function GuruManageMataPelajaranDetailAssignmentEditPage() {
  const loader = useLoaderData<LoaderDataGuruManageMataPelajaranDetailAssignmentEdit>()
  const revalidator = useRevalidator()
  const actionData = useActionData<ActionDataGuruManageMataPelajaranDetailAssignmentEdit>()
  const navigate = useNavigate()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<GuruManageMataPelajaranDetailAssignmentCreateFormType>({
    defaultValues: emptyValues,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    formHook.reset(translateRawToFormData(loader.assignment))
  }

  useEffect(() => {
    if (loader.mataPelajaran && loader.assignment) resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader.mataPelajaran])

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.message ?? '')
      navigate(AppNav.guru.manageMataPelajaranDetailAssignment({ mataPelajaranId: loader.mataPelajaran.id }))
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='!p-0 mt-4 lg:mt-8'>
      <GuruManageMataPelajaranDetailTab mataPelajaran={loader.mataPelajaran} activeTabKey={TabKey.ASSIGNMENT} />

      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <div className='p-4 lg:px-8'>
          <div className='flex flex-row items-center gap-4'>
            <h2 className='font-semibold text-xl'>Edit Tugas</h2>
            <div className='grow' />
            <BackButton buttonProps={{ size: 'sm', variant: 'outlined', color: 'secondary' }} />
          </div>
          <hr className='my-4' />

          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <AdminManageMataPelajaranDetailAssignmentFormComponent />
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
        </div>
      </fetcher.Form>
    </Card>
  )
}
