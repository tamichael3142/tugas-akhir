import { Akun } from '@prisma/client'
import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { ReactNode, useEffect, useState } from 'react'
import { StaticSelect, TextInput } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import DBHelpers from '~/database/helpers'
import OrtuPageContainer from '~/layouts/ortu/OrtuPageContainer'
import { LoaderDataOrtuViolations } from '~/types/loaders-data/ortu'
import { format } from 'date-fns'
import constants from '~/constants'

const sectionPrefix = 'ortu-violations'

export default function OrtuViolationsPage() {
  const loader = useLoaderData<LoaderDataOrtuViolations>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const revalidator = useRevalidator()

  const currentSiswaId = searchParams.get('siswaId') ?? ''
  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    params.set('page', '1')
    navigate(`?${params.toString()}`, { replace: false })
  }

  function handleSiswaChange(siswaId: Akun['id']) {
    const params = new URLSearchParams(searchParams)
    if (siswaId) params.set('siswaId', siswaId)
    else params.delete('siswaId')
    params.delete('page')
    navigate(`?${params.toString()}`, { replace: false })
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    navigate(`?${params.toString()}`, { replace: false })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateParams({ search: searchText || undefined })
    }, 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  function FilterGridItem({ children }: { children?: ReactNode }) {
    return <div className='col-span-3 md:col-span-1'>{children}</div>
  }

  if (revalidator.state === 'loading' || !loader.user) return <LoadingFullScreen />
  return (
    <OrtuPageContainer title='Violations'>
      <StaticSelect
        className='max-w-md mb-6'
        options={[
          { value: '', label: 'Choose a student...' },
          ...(loader.user.children
            ? loader.user.children.map(item => ({
                value: item.siswaId,
                label: DBHelpers.akun.getDisplayName(item.siswa),
              }))
            : []),
        ]}
        selectProps={{
          value: currentSiswaId,
          onChange: e => handleSiswaChange(e.target.value),
        }}
      />

      {!currentSiswaId ? (
        <div className='bg-neutral-100 rounded-xl p-4 shadow'>
          <p className='font-semibold mb-2'>Oops!</p>
          <p className='text-sm'>Please select a student.</p>
        </div>
      ) : (
        <>
          <Card key={`${sectionPrefix}-card`} className='mb-8 shadow-lg'>
            <div className='grid grid-cols-3 gap-4'>
              <FilterGridItem>
                <TextInput
                  label='Search'
                  inputProps={{
                    placeholder: 'Search by student or description...',
                    value: searchText,
                    onChange: e => setSearchText(e.target.value),
                  }}
                />
              </FilterGridItem>
              <FilterGridItem>
                <TextInput
                  label='From Date'
                  inputProps={{
                    type: 'date',
                    value: searchParams.get('startDate') ?? '',
                    onChange: e => updateParams({ startDate: e.target.value || undefined }),
                  }}
                />
              </FilterGridItem>
              <FilterGridItem>
                <TextInput
                  label='To Date'
                  inputProps={{
                    type: 'date',
                    value: searchParams.get('endDate') ?? '',
                    onChange: e => updateParams({ endDate: e.target.value || undefined }),
                  }}
                />
              </FilterGridItem>
            </div>
          </Card>

          <DataGrid
            id={`${sectionPrefix}-data-grid`}
            columns={[
              { field: 'siswa', label: 'Student', render: row => DBHelpers.akun.getDisplayName(row.siswa) },
              { field: 'kelas', label: 'Class', render: row => row.kelas.nama },
              { field: 'remark', label: 'Description', render: row => row.remark || '-' },
              {
                field: 'createdAt',
                label: 'Violation Date',
                render: row => format(new Date(row.createdAt), constants.dateFormats.dateColumn),
              },
              { field: 'poin', label: 'Points' },
              {
                field: 'createdBy',
                label: 'Created By',
                render: row => (row.createdBy ? DBHelpers.akun.getDisplayName(row.createdBy) : '-'),
              },
            ]}
            rows={loader.pelanggarans.data}
            pagination={{
              page: loader.pelanggarans.pagination.page,
              pageSize: loader.pelanggarans.pagination.limit,
              total: loader.pelanggarans.pagination.total,
              totalPages: loader.pelanggarans.pagination.totalPages,
              onPageChange: handlePageChange,
            }}
            className='shadow-secondary'
          />
        </>
      )}
    </OrtuPageContainer>
  )
}
