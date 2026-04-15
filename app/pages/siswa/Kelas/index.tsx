import { Link, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { DataGrid, LoadingFullScreen } from '~/components/ui'
import AppNav from '~/navigation'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import DBHelpers from '~/database/helpers'
import { LoaderDataSiswaKelas } from '~/types/loaders-data/siswa'
import SiswaPageContainer from '~/layouts/siswa/SiswaPageContainer'

const sectionPrefix = 'siswa-daftar-kelas'

export default function SiswaKelasPage() {
  const loader = useLoaderData<LoaderDataSiswaKelas>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const revalidator = useRevalidator()

  function handlePageChange({
    newPage,
    semesterAjaranId,
    tahunAjaranId,
    waliId,
  }: {
    newPage: number
    tahunAjaranId?: string
    semesterAjaranId?: string
    waliId?: string
  }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (tahunAjaranId) params.set('tahunAjaranId', tahunAjaranId)
    else params.delete('tahunAjaranId')
    if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
    else params.delete('semesterAjaranId')
    if (waliId) params.set('waliId', waliId)
    else params.delete('waliId')
    navigate(`?${params.toString()}`, { replace: false })
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <SiswaPageContainer title='Kelas'>
      {loader.kelass && Array.isArray(loader.kelass.data) ? (
        <DataGrid
          id={`${sectionPrefix}-data-grid`}
          columns={[
            { field: 'nama', label: 'Nama' },
            { field: 'tahunAjaran', label: 'Tahun Ajaran', render: row => row.tahunAjaran.nama },
            {
              field: 'wali',
              label: 'Wali Kelas',
              render: row => (row.wali ? DBHelpers.akun.getDisplayName(row.wali) : '-'),
            },
            {
              field: 'actions',
              label: 'Aksi',
              render: row => {
                return (
                  <DataGridActionButtonWrapper>
                    <Link to={AppNav.siswa.kelasDetailMataPelajaran({ kelasId: row.id })}>
                      <DataGridActionButton
                        icon={DataGridActionButtonHelper.getDetailIcon()}
                        color='info'
                        label={'Detail Kelas'}
                      />
                    </Link>
                  </DataGridActionButtonWrapper>
                )
              },
            },
          ]}
          rows={loader.kelass.data}
          pagination={{
            page: loader.kelass.pagination.page,
            pageSize: loader.kelass.pagination.limit,
            total: loader.kelass.pagination.total,
            totalPages: loader.kelass.pagination.totalPages,
            onPageChange: newPage =>
              handlePageChange({
                newPage,
                tahunAjaranId: searchParams.get('tahunAjaranId') ?? undefined,
                semesterAjaranId: searchParams.get('semesterAjaranId') ?? undefined,
                waliId: searchParams.get('waliId') ?? undefined,
              }),
          }}
          className='shadow-secondary'
        />
      ) : null}
    </SiswaPageContainer>
  )
}
