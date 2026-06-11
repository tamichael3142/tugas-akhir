import { Link, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { DataGrid, LoadingFullScreen } from '~/components/ui'
import AppNav from '~/navigation'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import DBHelpers from '~/database/helpers'
import { LoaderDataSiswaEkstrakulikuler } from '~/types/loaders-data/siswa'
import SiswaPageContainer from '~/layouts/siswa/SiswaPageContainer'

const sectionPrefix = 'siswa-ekstrakulikuler'

export default function SiswaEkstrakulikulerPage() {
  const loader = useLoaderData<LoaderDataSiswaEkstrakulikuler>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const revalidator = useRevalidator()

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    navigate(`?${params.toString()}`, { replace: false })
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <SiswaPageContainer title='Extracurricular'>
      {loader.ekstrakulikulers && Array.isArray(loader.ekstrakulikulers.data) ? (
        <DataGrid
          id={`${sectionPrefix}-data-grid`}
          columns={[
            { field: 'nama', label: 'Name' },
            { field: 'tahunAjaran', label: 'Academic Year', render: row => row.tahunAjaran.nama },
            {
              field: 'pengajar',
              label: 'Teacher',
              render: row => (row.pengajar ? DBHelpers.akun.getDisplayName(row.pengajar) : '-'),
            },
            {
              field: 'actions',
              label: 'Action',
              render: row => {
                return (
                  <DataGridActionButtonWrapper>
                    <Link to={AppNav.siswa.ekstrakulikulerDetail({ ekstrakulikulerId: row.id })}>
                      <DataGridActionButton
                        icon={DataGridActionButtonHelper.getDetailIcon()}
                        color='info'
                        label={'Extracurricular Detail'}
                      />
                    </Link>
                  </DataGridActionButtonWrapper>
                )
              },
            },
          ]}
          rows={loader.ekstrakulikulers.data}
          pagination={{
            page: loader.ekstrakulikulers.pagination.page,
            pageSize: loader.ekstrakulikulers.pagination.limit,
            total: loader.ekstrakulikulers.pagination.total,
            totalPages: loader.ekstrakulikulers.pagination.totalPages,
            onPageChange: handlePageChange,
          }}
          className='shadow-secondary'
        />
      ) : null}
    </SiswaPageContainer>
  )
}
