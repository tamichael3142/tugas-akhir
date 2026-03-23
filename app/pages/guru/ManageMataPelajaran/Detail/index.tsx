import { Outlet, useLoaderData, useRevalidator } from '@remix-run/react'
import { format } from 'date-fns'
import { ReactNode } from 'react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import constants from '~/constants'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import DBHelpers from '~/database/helpers'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import AppNav from '~/navigation'
import { LoaderDataGuruManageMataPelajaranDetail } from '~/types/loaders-data/guru'
import EnumsTitleUtils from '~/utils/enums-title.utils'

const sectionPrefix = 'guru-manage-mata-pelajaran-detail'

export default function GuruMataPelajaranDetailPage() {
  const loader = useLoaderData<LoaderDataGuruManageMataPelajaranDetail>()
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
      title={`Mata Pelajaran: ${loader.mataPelajaran?.nama}`}
      actions={[<BackButton key={`${sectionPrefix}-back-button`} to={AppNav.guru.daftarKelas()} />]}
    >
      <Card className='!p-0'>
        <div className='grid grid-cols-3 gap-4 lg:gap-8 p-4 lg:p-8'>
          <DetailItem label={'Tahun Ajaran'}>{loader.mataPelajaran?.semesterAjaran?.tahunAjaran?.nama}</DetailItem>
          <DetailItem label={'Semester Ajaran'}>
            {EnumsTitleUtils.getSemesterAjaranUrutan(
              loader.mataPelajaran?.semesterAjaran?.urutan as SemesterAjaranUrutan,
            )}
          </DetailItem>
          {loader.mataPelajaran?.guru ? (
            <DetailItem label={'Guru'}>{DBHelpers.akun.getDisplayName(loader.mataPelajaran.guru)}</DetailItem>
          ) : null}
          <DetailItem label={'Status'}>{loader.mataPelajaran?.deletedAt ? 'Deleted' : 'Active'}</DetailItem>
          {loader.mataPelajaran?.createdAt ? (
            <DetailItem label={'Created At'}>
              {format(new Date(loader.mataPelajaran?.createdAt), constants.dateFormats.dateColumn)}
            </DetailItem>
          ) : null}
          {loader.mataPelajaran?.updatedAt ? (
            <DetailItem label={'Updated At'}>
              {format(new Date(loader.mataPelajaran?.updatedAt), constants.dateFormats.dateColumn)}
            </DetailItem>
          ) : null}
          {loader.mataPelajaran?.deletedAt ? (
            <DetailItem label={'Deleted At'}>
              {format(new Date(loader.mataPelajaran?.deletedAt), constants.dateFormats.dateColumn)}
            </DetailItem>
          ) : null}
        </div>
      </Card>

      <Outlet />
    </GuruPageContainer>
  )
}
