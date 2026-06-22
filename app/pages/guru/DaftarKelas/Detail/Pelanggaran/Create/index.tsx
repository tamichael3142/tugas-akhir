import { useActionData, useFetcher, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import { LoaderDataGuruDaftarKelasDetailPelanggaranCreate } from '~/types/loaders-data/guru'
import { ActionDataGuruDaftarKelasDetailPelanggaranCreate } from '~/types/actions-data/guru'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { emptyValues, resolver, GuruDaftarKelasDetailPelanggaranCreateFormType } from './form'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import AppNav from '~/navigation'
import { Button } from '~/components/forms'
import { FaSave } from 'react-icons/fa'
import GuruDaftarKelasDetailPelanggaranFormComponent from '../form-component'
import useAuthStore from '~/store/authStore'
import GuruDaftarKelasDetailTab, { TabKey } from '../../_components/Tab'

const sectionPrefix = 'guru-daftar-kelas-detail-pelanggaran-create'

export default function GuruDaftarKelasDetailPelanggaranCreatePage() {
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailPelanggaranCreate>()
  const revalidator = useRevalidator()
  const actionData = useActionData<ActionDataGuruDaftarKelasDetailPelanggaranCreate>()
  const navigate = useNavigate()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })
  const user = useAuthStore(state => state.user)

  const formHook = useRemixForm<GuruDaftarKelasDetailPelanggaranCreateFormType>({
    defaultValues: emptyValues,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    formHook.reset({ ...emptyValues })
  }

  useEffect(() => {
    if (loader.kelas) resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader.kelas])

  useEffect(() => {
    if (actionData?.success) {
      resetForm()
      toast.success(actionData.message ?? '')
      navigate(AppNav.guru.daftarKelasDetailPelanggaran({ kelasId: loader.kelas?.id ?? '' }))
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='!p-0 mt-4 lg:mt-8'>
      <GuruDaftarKelasDetailTab kelas={loader.kelas} activeTabKey={TabKey.PELANGGARAN} />

      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <div className='p-4 lg:px-8'>
          <div className='flex flex-row items-center gap-4'>
            <h2 className='font-semibold text-xl'>Note Violation</h2>
            <div className='grow' />
            <BackButton buttonProps={{ size: 'sm', variant: 'outlined', color: 'secondary' }} />
          </div>
          <hr className='my-4' />

          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <GuruDaftarKelasDetailPelanggaranFormComponent siswas={loader.siswas} />
          </RemixFormProvider>
          <hr className='my-8' />
          <div className='flex flex-row items-center justify-end gap-4'>
            <Button variant='text' color='secondary' label='Empty form' buttonProps={{ onClick: resetForm }} />
            <Button
              variant='contained'
              color='primary'
              startIcon={<FaSave />}
              label='Save'
              buttonProps={{ disabled: loader.kelas?.waliId !== user?.id, type: 'submit' }}
            />
          </div>
        </div>
      </fetcher.Form>
    </Card>
  )
}
