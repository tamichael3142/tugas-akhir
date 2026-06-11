import { Link, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { TextInput } from '~/components/forms'
import { DataGrid, LoadingFullScreen } from '~/components/ui'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import AppNav from '~/navigation'
import { LoaderDataGuruManageEkstrakulikuler } from '~/types/loaders-data/guru'

const sectionPrefix = 'guru-manage-ekstrakulikuler'

export default function GuruManageEkstrakulikulerPage() {
  const loader = useLoaderData<LoaderDataGuruManageEkstrakulikuler>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const revalidator = useRevalidator()

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
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
    <GuruPageContainer title='Manage Extracurricular'>
      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        leadingView={
          <div className='flex flex-row items-center justify-end gap-4 mb-5'>
            <TextInput
              className='max-w-xs'
              inputProps={{
                placeholder: 'Search extracurricular...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
          </div>
        }
        columns={[
          { field: 'nama', label: 'Name' },
          { field: 'ruangan', label: 'Room' },
          { field: 'tahunAjaran', label: 'Academic Year', render: row => row.tahunAjaran.nama },
          {
            field: 'actions',
            label: 'Action',
            render: row => (
              <DataGridActionButtonWrapper>
                <Link to={AppNav.guru.manageEkstrakulikulerDetailDaftarSiswa({ ekstrakulikulerId: row.id })}>
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
        rows={loader.ekstrakulikulers.data}
        pagination={{
          page: loader.ekstrakulikulers.pagination.page,
          pageSize: loader.ekstrakulikulers.pagination.limit,
          total: loader.ekstrakulikulers.pagination.total,
          totalPages: loader.ekstrakulikulers.pagination.totalPages,
          onPageChange: handlePageChange,
        }}
        className='shadow-primary'
      />
    </GuruPageContainer>
  )
}
