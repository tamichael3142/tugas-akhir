import { Link, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { FaPlus } from 'react-icons/fa'
import { Button } from '~/components/forms'
import { DataGrid, LoadingFullScreen } from '~/components/ui'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import AppNav from '~/navigation'
import { LoaderDataGuruManageAbsensi } from '~/types/loaders-data/guru'
import * as dateFns from 'date-fns'
import constants from '~/constants'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import { Tooltip } from '~/components/ui/Tooltip'

const sectionPrefix = 'guru-manage-absensi'

export default function GuruManageAbsensiPage() {
  const loader = useLoaderData<LoaderDataGuruManageAbsensi>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const revalidator = useRevalidator()

  function handlePageChange({
    newPage,
    semesterAjaranId,
    kelasId,
  }: {
    newPage: number
    semesterAjaranId?: string
    kelasId?: string
  }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
    else params.delete('semesterAjaranId')
    if (kelasId) params.set('kelasId', kelasId)
    else params.delete('kelasId')
    navigate(`?${params.toString()}`, { replace: false })
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <GuruPageContainer
      title='Manage Absensi'
      actions={[
        <Tooltip key={`${sectionPrefix}-add-button`} label='Buat absensi dari halaman kelas detail' placement='left'>
          <Link to={AppNav.guru.daftarKelas()}>
            <Button label='Buat Baru' startIcon={<FaPlus />} onlyIconOnSmallView />
          </Link>
        </Tooltip>,
      ]}
    >
      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        columns={[
          { field: 'tanggalText', label: 'Tanggal', render: row => row.tanggalText },
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
            label: 'Aksi',
            render: row => {
              const now = new Date()
              const mutable =
                row.tanggal.getFullYear() >= now.getFullYear() &&
                row.tanggal.getMonth() >= now.getMonth() &&
                row.tanggal.getDate() >= now.getDate()

              return (
                <DataGridActionButtonWrapper>
                  <Link to={AppNav.guru.manageAbsensiEdit({ absensiId: row.id })}>
                    <DataGridActionButton
                      icon={DataGridActionButtonHelper.getEditIcon()}
                      color='warning'
                      label={'Edit'}
                      buttonProps={{ disabled: !mutable }}
                    />
                  </Link>
                </DataGridActionButtonWrapper>
              )
            },
          },
        ]}
        rows={loader.absensis.data}
        pagination={{
          page: loader.absensis.pagination.page,
          pageSize: loader.absensis.pagination.limit,
          total: loader.absensis.pagination.total,
          totalPages: loader.absensis.pagination.totalPages,
          onPageChange: newPage =>
            handlePageChange({
              newPage,
              semesterAjaranId: searchParams.get('semesterAjaranId') ?? undefined,
              kelasId: searchParams.get('kelasId') ?? undefined,
            }),
        }}
        className='shadow-primary'
      />
    </GuruPageContainer>
  )
}
