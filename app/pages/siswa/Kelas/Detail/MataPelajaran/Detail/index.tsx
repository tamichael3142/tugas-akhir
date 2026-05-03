import { Outlet, useLoaderData } from '@remix-run/react'
import { ReactNode, Fragment } from 'react'
import { Card } from '~/components/ui'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import DBHelpers from '~/database/helpers'
import { LoaderDataSiswaKelasDetailMataPelajaranDetail } from '~/types/loaders-data/siswa'
import EnumsTitleUtils from '~/utils/enums-title.utils'

export default function SiswaKelasDetailMataPelajaranDetail() {
  const loader = useLoaderData<LoaderDataSiswaKelasDetailMataPelajaranDetail>()

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
        </div>
      </Card>

      <Outlet />

      <div className='h-72' />
    </Fragment>
  )
}
