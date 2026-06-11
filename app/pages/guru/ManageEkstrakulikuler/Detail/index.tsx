import { Outlet, useLoaderData, useRevalidator } from '@remix-run/react'
import { format } from 'date-fns'
import { ReactNode } from 'react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import constants from '~/constants'
import DBHelpers from '~/database/helpers'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import { LoaderDataGuruManageEkstrakulikulerDetail } from '~/types/loaders-data/guru'

const sectionPrefix = 'guru-manage-ekstrakulikuler-detail'

export default function GuruManageEkstrakulikulerDetailPage() {
  const loader = useLoaderData<LoaderDataGuruManageEkstrakulikulerDetail>()
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
      title={`Ekstrakulikuler: ${loader.ekstrakulikuler?.nama}`}
      actions={[<BackButton key={`${sectionPrefix}-back-button`} />]}
    >
      <Card className='p-0!'>
        <div className='grid grid-cols-3 gap-4 lg:gap-8 p-4 lg:p-8'>
          <DetailItem label={'Room'}>{loader.ekstrakulikuler?.ruangan ?? '-'}</DetailItem>
          <DetailItem label={'Academic Year'}>{loader.ekstrakulikuler?.tahunAjaran.nama}</DetailItem>
          {loader.ekstrakulikuler?.pengajar ? (
            <DetailItem label={'Teacher'}>{DBHelpers.akun.getDisplayName(loader.ekstrakulikuler.pengajar)}</DetailItem>
          ) : null}
          <DetailItem label={'Status'}>{loader.ekstrakulikuler?.deletedAt ? 'Deleted' : 'Active'}</DetailItem>
          {loader.ekstrakulikuler?.createdAt ? (
            <DetailItem label={'Created At'}>
              {format(new Date(loader.ekstrakulikuler.createdAt), constants.dateFormats.dateColumn)}
            </DetailItem>
          ) : null}
          {loader.ekstrakulikuler?.updatedAt ? (
            <DetailItem label={'Updated At'}>
              {format(new Date(loader.ekstrakulikuler.updatedAt), constants.dateFormats.dateColumn)}
            </DetailItem>
          ) : null}
          {loader.ekstrakulikuler?.deletedAt ? (
            <DetailItem label={'Deleted At'}>
              {format(new Date(loader.ekstrakulikuler.deletedAt), constants.dateFormats.dateColumn)}
            </DetailItem>
          ) : null}
        </div>
      </Card>

      <Outlet />
    </GuruPageContainer>
  )
}
