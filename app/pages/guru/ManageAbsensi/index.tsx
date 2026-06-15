import { Link, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { ReactNode, useEffect, useState } from 'react'
import { StaticSelect, TextInput } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import AppNav from '~/navigation'
import { LoaderDataGuruManageAbsensi } from '~/types/loaders-data/guru'
import * as dateFns from 'date-fns'
import constants from '~/constants'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'

const sectionPrefix = 'guru-manage-absensi'

export default function GuruManageAbsensiPage() {
  const loader = useLoaderData<LoaderDataGuruManageAbsensi>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const revalidator = useRevalidator()

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

  const selectedTahunAjaran = loader.tahunAjarans.find(t => t.id === (searchParams.get('tahunAjaranId') ?? ''))
  const semesterOptions = selectedTahunAjaran?.semesterAjaran ?? []

  function FilterGridItem({ children }: { children?: ReactNode }) {
    return <div className='col-span-3 md:col-span-1'>{children}</div>
  }

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    params.set('page', '1')
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

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <GuruPageContainer title='Manage Attendance'>
      <Card key={`${sectionPrefix}-filter-card`} className='mb-8 shadow-lg'>
        <div className='grid grid-cols-3 gap-4'>
          <FilterGridItem>
            <TextInput
              label='Search'
              inputProps={{
                placeholder: 'Search by label, date, class, or student...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <StaticSelect
              label='Academic Year'
              options={[
                { value: '', label: 'All' },
                ...loader.tahunAjarans.map(item => ({ value: item.id, label: item.nama })),
              ]}
              selectProps={{
                value: searchParams.get('tahunAjaranId') ?? '',
                onChange: e =>
                  updateParams({ tahunAjaranId: e.target.value || undefined, semesterAjaranId: undefined }),
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <StaticSelect
              label='Semester'
              options={[
                { value: '', label: 'All' },
                ...semesterOptions.map(item => ({
                  value: item.id,
                  label: EnumsTitleUtils.getSemesterAjaranUrutan(item.urutan as SemesterAjaranUrutan),
                })),
              ]}
              selectProps={{
                value: searchParams.get('semesterAjaranId') ?? '',
                onChange: e => updateParams({ semesterAjaranId: e.target.value || undefined }),
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
          { field: 'tanggalText', label: 'Date', render: row => row.tanggalText },
          { field: 'kelas', label: 'Class', render: row => row.kelas.nama },
          { field: 'label', label: 'Label', render: row => row.label },
          {
            field: 'createdAt',
            label: 'Created At',
            render: row => dateFns.format(row.createdAt, constants.dateFormats.dateColumn),
          },
          {
            field: 'updatedAt',
            label: 'Updated At',
            render: row => dateFns.format(row.updatedAt, constants.dateFormats.dateColumn),
          },
          {
            field: 'actions',
            label: 'Action',
            render: row => (
              <DataGridActionButtonWrapper>
                <Link to={AppNav.guru.manageAbsensiEdit({ absensiId: row.id })}>
                  <DataGridActionButton icon={DataGridActionButtonHelper.getEditIcon()} color='warning' label='Edit' />
                </Link>
                <Link to={AppNav.guru.manageAbsensiMutate({ absensiId: row.id })}>
                  <DataGridActionButton
                    icon={DataGridActionButtonHelper.getMutateIcon()}
                    color='secondary'
                    label='Mutate'
                  />
                </Link>
              </DataGridActionButtonWrapper>
            ),
          },
        ]}
        rows={loader.absensis.data}
        pagination={{
          page: loader.absensis.pagination.page,
          pageSize: loader.absensis.pagination.limit,
          total: loader.absensis.pagination.total,
          totalPages: loader.absensis.pagination.totalPages,
          onPageChange: handlePageChange,
        }}
        className='shadow-primary'
      />
    </GuruPageContainer>
  )
}
