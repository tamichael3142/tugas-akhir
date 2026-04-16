import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { TextInput } from '~/components/forms'
import { useEffect, useState } from 'react'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import { format } from 'date-fns'
import constants from '~/constants'
import SiswaKelasDetailMataPelajaranDetailTab, { TabKey } from '../_components/Tab'
import { LoaderDataSiswaKelasDetailMataPelajaranDetailPelanggaran } from '~/types/loaders-data/siswa'

const sectionPrefix = 'siswa-kelas-detail-mata-pelajaran-detail-pelanggaran'

export default function SiswaKelasDetailMataPelajaranDetailPelanggaranPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataSiswaKelasDetailMataPelajaranDetailPelanggaran>()
  const revalidator = useRevalidator()

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

  function handlePageChange({ newPage, search }: { newPage: number; search?: string }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (search) params.set('search', search)
    else params.delete('search')
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
      <SiswaKelasDetailMataPelajaranDetailTab
        kelas={loader.kelas}
        mataPelajaran={loader.mataPelajaran}
        activeTabKey={TabKey.PELANGGARAN}
      />

      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        leadingView={
          <div className='flex flex-col sm:flex-row items-center gap-4 mb-5'>
            <TextInput
              className='max-w-xs'
              inputProps={{
                placeholder: 'Cari pelanggaran...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
            <div className='grow'></div>
          </div>
        }
        columns={[
          { field: 'remark', label: 'Keterangan' },
          { field: 'poin', label: 'Poin Pengurangan' },
          {
            field: 'createdAt',
            label: 'Created At',
            render: row => format(new Date(row.createdAt), constants.dateFormats.rawDateTimeInput),
          },
        ]}
        rows={loader.pelanggarans.data}
        pagination={{
          page: loader.pelanggarans.pagination.page,
          pageSize: loader.pelanggarans.pagination.limit,
          total: loader.pelanggarans.pagination.total,
          totalPages: loader.pelanggarans.pagination.totalPages,
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='border-none'
      />
    </Card>
  )
}
