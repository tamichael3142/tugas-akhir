import { useActionData, useFetcher, useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { BackButton, Card } from '~/components/ui'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import AppNav from '~/navigation'
import { GuruMasterPengumumanCreateFormType, resolver, emptyUserValue } from './form'
import { ActionDataGuruMasterPengumumanCreate } from '~/types/actions-data/guru'
import toast from 'react-hot-toast'
import GuruMasterPengumumanFormComponent from '../form-component'

const sectionPrefix = 'guru-master-pengumuman-create'

export default function GuruMasterPengumumanCreatePage() {
  const actionData = useActionData<ActionDataGuruMasterPengumumanCreate>()
  const navigate = useNavigate()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<GuruMasterPengumumanCreateFormType>({
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
      navigate(AppNav.guru.masterPengumuman())
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  return (
    <GuruPageContainer
      title='Create Pengumuman'
      actions={[<BackButton key={`${sectionPrefix}-add-button`} to={AppNav.guru.masterPengumuman()} />]}
    >
      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <Card className=''>
          <p className='font-semibold text-lg'>Tambah Pengumuman</p>
          <hr className='my-4' />

          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <GuruMasterPengumumanFormComponent />
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
    </GuruPageContainer>
  )
}
