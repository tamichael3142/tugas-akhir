import { Outlet, useLoaderData, useRevalidator } from '@remix-run/react'
import { format } from 'date-fns'
import { ReactNode } from 'react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import constants from '~/constants'
import DBHelpers from '~/database/helpers'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import { LoaderDataGuruDaftarKelasDetail } from '~/types/loaders-data/guru'

const sectionPrefix = 'guru-daftar-kelas-detail'

export default function GuruDaftarKelasDetailPage() {
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetail>()
  const revalidator = useRevalidator()

  function DetailItem({ label, children }: { label?: ReactNode; children?: ReactNode }) {
    return (
      <div className='col-span-3 lg:col-span-1 h-full'>
        <div className='text-sm font-semibold'>{label}</div>
        <div className='border-b py-2 px-1'>{children}</div>
      </div>
    )
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <GuruPageContainer
      title={`Kelas: ${loader.kelas?.nama}`}
      actions={[<BackButton key={`${sectionPrefix}-back-button`} />]}
    >
      <Card className='!p-0'>
        <div className='grid grid-cols-3 gap-4 lg:gap-8 p-4 lg:p-8'>
          <DetailItem label={'Tahun Ajaran'}>{loader.kelas?.tahunAjaran.nama}</DetailItem>
          {loader.kelas?.wali ? (
            <DetailItem label={'Wali Kelas'}>{DBHelpers.akun.getDisplayName(loader.kelas?.wali)}</DetailItem>
          ) : null}
          <DetailItem label={'Status'}>{loader.kelas?.deletedAt ? 'Deleted' : 'Active'}</DetailItem>
          {loader.kelas?.createdAt ? (
            <DetailItem label={'Created At'}>
              {format(new Date(loader.kelas?.createdAt), constants.dateFormats.dateColumn)}
            </DetailItem>
          ) : null}
          {loader.kelas?.updatedAt ? (
            <DetailItem label={'Updated At'}>
              {format(new Date(loader.kelas?.updatedAt), constants.dateFormats.dateColumn)}
            </DetailItem>
          ) : null}
          {loader.kelas?.deletedAt ? (
            <DetailItem label={'Deleted At'}>
              {format(new Date(loader.kelas?.deletedAt), constants.dateFormats.dateColumn)}
            </DetailItem>
          ) : null}
        </div>
      </Card>

      <Outlet />
    </GuruPageContainer>
  )
}
