import { Link, useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave, FaUserEdit } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import { ActionDataGuruManageAbsensiEdit } from '~/types/actions-data/guru'
import toast from 'react-hot-toast'
import GuruMasterPengumumanFormComponent from '../form-component'
import { LoaderDataGuruManageAbsensiEdit } from '~/types/loaders-data/guru'
import { GuruManageAbsensiEditFormType } from '../form-types'
import { emptyUserValue, resolver, translateRawToFormData } from './form'
import AppNav from '~/navigation'

const sectionPrefix = 'guru-manage-absensi-edit'

export default function GuruManageAbsensiEditPage() {
  const loader = useLoaderData<LoaderDataGuruManageAbsensiEdit>()
  const actionData = useActionData<ActionDataGuruManageAbsensiEdit>()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form-${loader.absensi?.id}` })
  const revalidator = useRevalidator()

  const formHook = useRemixForm<GuruManageAbsensiEditFormType>({
    defaultValues: emptyUserValue,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    if (loader && loader.absensi) formHook.reset(translateRawToFormData(loader.absensi))
  }

  useEffect(() => {
    if (loader && loader.absensi) resetForm()
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
    <GuruPageContainer title='Edit Absensi' actions={[<BackButton key={`${sectionPrefix}-back-button`} />]}>
      <RemixFormProvider key={`${sectionPrefix}-form-${loader.absensi?.id}`} {...formHook}>
        <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
          <Card className=''>
            <div className='flex flex-row items-center gap-4'>
              <p className='font-semibold text-lg'>Edit Absensi</p>
              <div className='grow' />
              <Link to={AppNav.guru.manageAbsensiMutate({ absensiId: loader.absensi?.id ?? '' })}>
                <Button color='secondary' label='Mutate Absensi' startIcon={<FaUserEdit />} />
              </Link>
            </div>
            <hr className='my-4' />

            <GuruMasterPengumumanFormComponent />
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
    </GuruPageContainer>
  )
}
