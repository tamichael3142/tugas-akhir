import { Outlet, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import { ReactNode } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { Card } from '~/components/ui'
import constants from '~/constants'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import DBHelpers from '~/database/helpers'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetail } from '~/types/loaders-data/guru'
import EnumsTitleUtils from '~/utils/enums-title.utils'

export default function GuruDaftarKelasDetailMataPelajaranDetail() {
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailMataPelajaranDetail>()

  function DetailItem({ label, children }: { label?: ReactNode; children?: ReactNode }) {
    return (
      <div className='col-span-3 lg:col-span-1 h-full'>
        <div className='text-sm font-semibold'>{label}</div>
        <div className='border-b py-2 px-1'>{children}</div>
      </div>
    )
  }

  return (
    <Fragment>
      <Card className='mt-4 lg:mt-8 p-4 lg:p-8'>
        <h2 className='text-lg font-bold'>Mata Pelajaran: {loader.mataPelajaran.nama}</h2>
        <hr className='my-4 lg:mb-8' />

        <div className='grid grid-cols-3 gap-4 lg:gap-8'>
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

      <div className='h-72' />
    </Fragment>
  )
}
