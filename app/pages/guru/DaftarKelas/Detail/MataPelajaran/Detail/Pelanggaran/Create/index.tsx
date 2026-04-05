import { useActionData, useFetcher, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreate } from '~/types/loaders-data/guru'
import GuruManageMataPelajaranDetailTab, { TabKey } from '../../_components/Tab'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreate } from '~/types/actions-data/guru'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { emptyValues, resolver, GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateFormType } from './form'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import AppNav from '~/navigation'
import { Button } from '~/components/forms'
import { FaSave } from 'react-icons/fa'
import AdminDaftarKelasDetailMataPelajaranDetailPelanggaranFormComponent from '../form-component'
import useAuthStore from '~/store/authStore'

const sectionPrefix = 'guru-daftar-kelas-detail-mata-pelajaran-detail-pelanggaran-create'

export default function GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreatePage() {
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreate>()
  const revalidator = useRevalidator()
  const actionData = useActionData<ActionDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreate>()
  const navigate = useNavigate()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })
  const user = useAuthStore(state => state.user)

  const formHook = useRemixForm<GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateFormType>({
    defaultValues: emptyValues,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    formHook.reset({
      ...emptyValues,
    })
  }

  useEffect(() => {
    if (loader.mataPelajaran) resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader.mataPelajaran])

  useEffect(() => {
    if (actionData?.success) {
      resetForm()
      toast.success(actionData.message ?? '')
      navigate(
        AppNav.guru.daftarKelasDetailMataPelajaranDetailPelanggaran({
          kelasId: loader.kelas?.id ?? '',
          mataPelajaranId: loader.mataPelajaran.id,
        }),
      )
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='!p-0 mt-4 lg:mt-8'>
      <GuruManageMataPelajaranDetailTab
        kelas={loader.kelas}
        mataPelajaran={loader.mataPelajaran}
        activeTabKey={TabKey.PELANGGARAN}
      />

      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <div className='p-4 lg:px-8'>
          <div className='flex flex-row items-center gap-4'>
            <h2 className='font-semibold text-xl'>Catat Pelanggaran</h2>
            <div className='grow' />
            <BackButton buttonProps={{ size: 'sm', variant: 'outlined', color: 'secondary' }} />
          </div>
          <hr className='my-4' />

          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <AdminDaftarKelasDetailMataPelajaranDetailPelanggaranFormComponent siswas={loader.siswas} />
          </RemixFormProvider>
          <hr className='my-8' />
          <div className='flex flex-row items-center justify-end gap-4'>
            <Button variant='text' color='secondary' label='Kosongkan form' buttonProps={{ onClick: resetForm }} />
            <Button
              variant='contained'
              color='primary'
              startIcon={<FaSave />}
              label='Simpan'
              buttonProps={{ disabled: loader.mataPelajaran.guruId !== user?.id, type: 'submit' }}
            />
          </div>
        </div>
      </fetcher.Form>
    </Card>
  )
}
