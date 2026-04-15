import { Link, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Button, TextInput } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import { LoaderDataSiswaKelasDetailMataPelajaran } from '~/types/loaders-data/siswa'
import DBHelpers from '~/database/helpers'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import AppNav from '~/navigation'
import SiswaKelasDetailTab, { SiswaKelasDetailTabProps, TabKey } from '../_components/Tab'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'

const sectionPrefix = 'siswa-kelas-detail-mata-pelajaran'

export default function SiswaKelasDetailMataPelajaranPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataSiswaKelasDetailMataPelajaran>()
  const revalidator = useRevalidator()

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

  function handlePageChange({
    newPage,
    search,
    semesterAjaranId,
  }: {
    newPage: number
    search?: string
    semesterAjaranId?: string
  }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (search) params.set('search', search)
    else params.delete('search')
    if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
    else params.delete('semesterAjaranId')
    navigate(`?${params.toString()}`, { replace: false })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (searchText) params.set('search', searchText)
      else params.delete('search')
      params.set('page', '1')
      navigate(`?${params.toString()}`, { replace: false })
    }, 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='!p-0 mt-4 lg:mt-8'>
      <SiswaKelasDetailTab
        kelas={loader.kelas as SiswaKelasDetailTabProps['kelas']}
        activeTabKey={TabKey.MATA_PELAJARAN}
      />

      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        leadingView={
          <div className='flex flex-col sm:flex-row items-center gap-4 mb-5'>
            <Button
              label={`Semester ${EnumsTitleUtils.getSemesterAjaranUrutan(loader.currentSemester?.urutan as SemesterAjaranUrutan)}`}
              color='primary'
              variant={'contained'}
            />
            <div className='grow'></div>
            <TextInput
              className='max-w-xs'
              inputProps={{
                placeholder: 'Cari mata pelajaran...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
          </div>
        }
        columns={[
          { field: 'nama', label: 'Nama' },
          {
            field: 'guru',
            label: 'Guru',
            render: row => (row.guru ? DBHelpers.akun.getDisplayName(row.guru) : '-'),
          },
          {
            field: 'actions',
            label: 'Aksi',
            render: row => (
              <DataGridActionButtonWrapper>
                <Link
                  to={AppNav.siswa.kelasDetailMataPelajaranDetailAssignment({
                    kelasId: loader.kelas?.id ?? '',
                    mataPelajaranId: row.id,
                  })}
                >
                  <DataGridActionButton
                    icon={DataGridActionButtonHelper.getDetailIcon()}
                    color='info'
                    label={'Detail'}
                  />
                </Link>
              </DataGridActionButtonWrapper>
            ),
          },
        ]}
        rows={loader.mataPelajarans.data}
        pagination={{
          page: loader.mataPelajarans.pagination.page,
          pageSize: loader.mataPelajarans.pagination.limit,
          total: loader.mataPelajarans.pagination.total,
          totalPages: loader.mataPelajarans.pagination.totalPages,
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='border-none'
      />
    </Card>
  )
}
