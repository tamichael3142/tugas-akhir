import { useFetcher, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentEdit } from '~/types/loaders-data/guru'
import GuruManageMataPelajaranDetailTab, { TabKey } from '../../_components/Tab'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentEdit } from '~/types/actions-data/guru'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import AppNav from '~/navigation'
import { Button } from '~/components/forms'
import { FaSave } from 'react-icons/fa'
import GuruDaftarKelasDetailMataPelajaranDetailAttachmentFormComponent from '../form-component'
import useAuthStore from '~/store/authStore'

const sectionPrefix = 'guru-daftar-kelas-detail-mata-pelajaran-detail-attachment-edit'

export default function GuruDaftarKelasDetailMataPelajaranDetailAttachmentEditPage() {
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentEdit>()
  const revalidator = useRevalidator()
  const navigate = useNavigate()
  const fetcher = useFetcher<ActionDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentEdit>({
    key: `${sectionPrefix}-form`,
  })
  const user = useAuthStore(state => state.user)

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      if (fetcher.data.success) {
        toast.success(fetcher.data.message ?? '')
        navigate(
          AppNav.guru.daftarKelasDetailMataPelajaranDetailAttachment({
            kelasId: loader.kelas.id,
            mataPelajaranId: loader.mataPelajaran.id,
          }),
        )
      } else if (fetcher.data?.error) {
        toast.error(fetcher.data.message ?? '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data])

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='!p-0 mt-4 lg:mt-8'>
      <GuruManageMataPelajaranDetailTab
        kelas={loader.kelas}
        mataPelajaran={loader.mataPelajaran}
        activeTabKey={TabKey.ATTACHMENT}
      />

      <fetcher.Form method='post' encType='multipart/form-data'>
        <div className='p-4 lg:px-8'>
          <div className='flex flex-row items-center gap-4'>
            <h2 className='font-semibold text-xl'>Edit Tugas</h2>
            <div className='grow' />
            <BackButton buttonProps={{ size: 'sm', variant: 'outlined', color: 'secondary' }} />
          </div>
          <hr className='my-4' />

          <GuruDaftarKelasDetailMataPelajaranDetailAttachmentFormComponent
            mataPelajaranAttachment={loader.attachment}
          />
          <hr className='my-8' />
          <div className='flex flex-row items-center justify-end gap-4'>
            <Button variant='text' color='secondary' label='Kosongkan form' buttonProps={{ type: 'reset' }} />
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
