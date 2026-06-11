import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { TextInput } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import { LoaderDataGuruManageEkstrakulikulerDetailDaftarSiswa } from '~/types/loaders-data/guru'
import GuruManageEkstrakulikulerDetailTab, { TabKey } from '../_components/Tab'

const sectionPrefix = 'guru-manage-ekstrakulikuler-detail-daftar-siswa'

export default function GuruManageEkstrakulikulerDetailDaftarSiswaPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataGuruManageEkstrakulikulerDetailDaftarSiswa>()
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
    <Card className='p-0! mt-4 lg:mt-8'>
      <GuruManageEkstrakulikulerDetailTab ekstrakulikuler={loader.ekstrakulikuler} activeTabKey={TabKey.DAFTAR_SISWA} />

      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        leadingView={
          <div className='flex flex-col sm:flex-row items-center gap-4 mb-5'>
            <div className='grow'></div>
            <TextInput
              className='max-w-xs'
              inputProps={{
                placeholder: 'Search student...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
          </div>
        }
        columns={[
          { field: 'username', label: 'Username', render: row => row.siswa?.username },
          { field: 'firstName', label: 'First Name', render: row => row.siswa?.firstName },
          { field: 'lastName', label: 'Last Name', render: row => row.siswa?.lastName },
          { field: 'email', label: 'Email', render: row => row.siswa?.email },
        ]}
        rows={loader.siswaPerEkstrakulikulers.data}
        pagination={{
          page: loader.siswaPerEkstrakulikulers.pagination.page,
          pageSize: loader.siswaPerEkstrakulikulers.pagination.limit,
          total: loader.siswaPerEkstrakulikulers.pagination.total,
          totalPages: loader.siswaPerEkstrakulikulers.pagination.totalPages,
          onPageChange: handlePageChange,
        }}
        className='border-none'
      />
    </Card>
  )
}
