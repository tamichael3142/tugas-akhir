import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { BackButton, DataGrid, LoadingFullScreen } from '~/components/ui'
import { LoaderDataSiswaAccountPelanggaran } from '~/types/loaders-data/siswa'
import SiswaPageContainer from '~/layouts/siswa/SiswaPageContainer'
import { format } from 'date-fns'
import constants from '~/constants'

const sectionPrefix = 'siswa-account-pelanggaran'

export default function SiswaAccountPelanggaranPage() {
  const loader = useLoaderData<LoaderDataSiswaAccountPelanggaran>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const revalidator = useRevalidator()

  function handlePageChange({ newPage }: { newPage: number }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    navigate(`?${params.toString()}`, { replace: false })
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <SiswaPageContainer
      title='Pelanggaran'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} label='Back' buttonProps={{ color: 'secondary' }} />]}
    >
      {loader.pelanggarans && Array.isArray(loader.pelanggarans.data) ? (
        <DataGrid
          id={`${sectionPrefix}-data-grid`}
          leadingView={<div className='font-bold mb-4'>Total Pengurangan Poin: {loader.totalPoint}</div>}
          columns={[
            { field: 'remark', label: 'Keterangan' },
            { field: 'poin', label: 'Poin Pengurangan' },
            { field: 'kelas', label: 'Kelas', render: row => row.kelas.nama },
            { field: 'kelas', label: 'Mata Pelajaran', render: row => row.mataPelajaran.nama },
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
            onPageChange: newPage =>
              handlePageChange({
                newPage,
              }),
          }}
          className='shadow-secondary'
        />
      ) : null}
    </SiswaPageContainer>
  )
}
