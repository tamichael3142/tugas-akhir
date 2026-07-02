import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { BackButton, DataGrid, LoadingFullScreen } from '~/components/ui'
import { LoaderDataSiswaAccountPelanggaran } from '~/types/loaders-data/siswa'
import SiswaPageContainer from '~/layouts/siswa/SiswaPageContainer'
import { format } from 'date-fns'
import constants from '~/constants'
import classNames from 'classnames'

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
      title='Violation'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} label='Back' buttonProps={{ color: 'secondary' }} />]}
    >
      {loader.pelanggarans && Array.isArray(loader.pelanggarans.data) ? (
        <DataGrid
          id={`${sectionPrefix}-data-grid`}
          leadingView={
            <div className='font-bold mb-4'>
              Total Minus Point:{' '}
              <div
                className={classNames('rounded-lg p-1 w-fit', {
                  ['bg-yellow-300']:
                    loader.totalPoint >= constants.treshold.first && loader.totalPoint < constants.treshold.second,
                  ['bg-red-500 text-white']: loader.totalPoint >= constants.treshold.second,
                })}
              >
                {loader.totalPoint}
                {loader.totalPoint >= constants.treshold.first && loader.totalPoint < constants.treshold.second
                  ? ' (Exceeding first tresshold!)'
                  : loader.totalPoint >= constants.treshold.second
                    ? ' (Exceeding second tresshold!)'
                    : null}
              </div>
            </div>
          }
          columns={[
            { field: 'remark', label: 'Remark' },
            { field: 'poin', label: 'Minus Points' },
            { field: 'kelas', label: 'Class', render: row => row.kelas.nama },
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
