import { Outlet, useLoaderData, useRevalidator } from '@remix-run/react'
import { ReactNode } from 'react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import DBHelpers from '~/database/helpers'
import SiswaPageContainer from '~/layouts/siswa/SiswaPageContainer'
import { LoaderDataSiswaKelasDetail } from '~/types/loaders-data/siswa'

const sectionPrefix = 'siswa-kelas-detail'

export default function SiswaKelasDetailPage() {
  const loader = useLoaderData<LoaderDataSiswaKelasDetail>()
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
    <SiswaPageContainer
      title={`Kelas: ${loader.kelas?.nama}`}
      actions={[<BackButton key={`${sectionPrefix}-back-button`} buttonProps={{ color: 'secondary' }} />]}
    >
      <Card className='!p-0'>
        <div className='grid grid-cols-3 gap-4 lg:gap-8 p-4 lg:p-8'>
          <DetailItem label={'Tahun Ajaran'}>{loader.kelas?.tahunAjaran.nama}</DetailItem>
          {loader.kelas?.wali ? (
            <DetailItem label={'Wali Kelas'}>{DBHelpers.akun.getDisplayName(loader.kelas?.wali)}</DetailItem>
          ) : null}
          <DetailItem label={'Status'}>{loader.kelas?.deletedAt ? 'Deleted' : 'Active'}</DetailItem>
        </div>
      </Card>

      <Outlet />
    </SiswaPageContainer>
  )
}
