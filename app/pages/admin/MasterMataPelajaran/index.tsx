import { Link, useFetcher, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { FaPlus } from 'react-icons/fa'
import { Button, StaticSelect } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { LoaderDataAdminMasterMataPelajaran } from '~/types/loaders-data/admin'
import * as dateFns from 'date-fns'
import constants from '~/constants'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import { usePopup } from '~/hooks/usePopup'
import { MataPelajaran } from '@prisma/client'
import { Fragment } from 'react/jsx-runtime'
import { ReactNode, useCallback, useEffect } from 'react'
import { ActionDataAdminMasterMataPelajaranDelete } from '~/types/actions-data/admin'
import DBHelpers from '~/database/helpers'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'

const sectionPrefix = 'admin-master-mata-pelajaran'
const deleteFormId = `${sectionPrefix}-delete-form`

export default function AdminMasterMataPelajaranPage() {
  const loader = useLoaderData<LoaderDataAdminMasterMataPelajaran>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fetcher = useFetcher<ActionDataAdminMasterMataPelajaranDelete>({ key: deleteFormId })
  const revalidator = useRevalidator()
  const popup = usePopup()

  const isDeleting = fetcher.state === 'submitting'
  const isSuccess = fetcher.data?.success

  const selectedTahunAjaran = useCallback(() => {
    const selectedTahunAjaranId = searchParams.get('tahunAjaranId') ?? ''
    return loader.tahunAjarans.find(item => item.id === selectedTahunAjaranId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('tahunAjaranId')])()

  const getSemesterAjaranOptions = useCallback(() => {
    if (selectedTahunAjaran && selectedTahunAjaran.semesterAjaran) return selectedTahunAjaran.semesterAjaran
    else return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('tahunAjaranId')])

  useEffect(() => {
    if (isSuccess) {
      fetcher.load(AppNav.admin.masterMataPelajaran())
      revalidator.revalidate() // refresh data loader parent
      popup.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, revalidator])

  function handlePageChange({
    newPage,
    tahunAjaranId,
    semesterAjaranId,
    guruId,
  }: {
    newPage: number
    tahunAjaranId?: string
    semesterAjaranId?: string
    guruId?: string
  }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (tahunAjaranId) params.set('tahunAjaranId', tahunAjaranId)
    else params.delete('tahunAjaranId')
    if (guruId) params.set('guruId', guruId)
    else params.delete('guruId')
    if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
    else params.delete('semesterAjaranId')
    navigate(`?${params.toString()}`, { replace: false })
  }

  function openDeletePopup(row: MataPelajaran) {
    popup.open({
      title: 'Hapus mata pelajaran?',
      onClose: popup.close,
      content: (
        <Fragment>
          <p>
            Apakah anda yakin untuk menghapus mata pelajaran{' '}
            <span className='font-semibold text-red-500'>{row.nama}</span>?
          </p>
          <fetcher.Form
            id={deleteFormId}
            method='delete'
            action={AppNav.adminAction.masterMataPelajaranDelete({ mataPelajaranId: row.id })}
          ></fetcher.Form>
        </Fragment>
      ),
      actionButtons: [
        {
          label: 'Cancel',
          color: 'secondary',
          variant: 'text',
          buttonProps: { onClick: popup.close },
        },
        {
          label: isDeleting ? 'Loading...' : 'Delete',
          color: 'primary',
          variant: 'contained',
          buttonProps: { type: 'submit', form: deleteFormId, disabled: isDeleting },
        },
      ],
    })
  }

  function FilterGridItem({ children }: { children?: ReactNode }) {
    return <div className='col-span-2 md:col-span-1'>{children}</div>
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <AdminPageContainer
      title='Master Mata Pelajaran'
      actions={[
        <Link key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterMataPelajaranCreate()}>
          <Button label='Tambah' startIcon={<FaPlus />} onlyIconOnSmallView />
        </Link>,
      ]}
    >
      <Card className='mb-8 shadow-lg'>
        <div className='grid grid-cols-2 gap-4'>
          <FilterGridItem>
            <StaticSelect
              label='Tahun Ajaran'
              options={[
                { value: '', label: 'Semua' },
                ...loader.tahunAjarans.map(item => ({ value: item.id, label: item.nama })),
              ]}
              selectProps={{
                value: searchParams.get('tahunAjaranId') ?? '',
                onChange: newValue => {
                  handlePageChange({
                    newPage: loader.mataPelajarans.pagination.page,
                    tahunAjaranId: newValue.target.value,
                    semesterAjaranId: '',
                    guruId: searchParams.get('guruId') ?? '',
                  })
                },
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <StaticSelect
              label='Semester Ajaran'
              options={[
                { value: '', label: 'Semua' },
                ...getSemesterAjaranOptions().map(item => ({
                  value: item.id,
                  label: EnumsTitleUtils.getSemesterAjaranUrutan(item.urutan as SemesterAjaranUrutan),
                })),
              ]}
              selectProps={{
                value: searchParams.get('semesterAjaranId') ?? '',
                onChange: newValue => {
                  handlePageChange({
                    newPage: loader.mataPelajarans.pagination.page,
                    tahunAjaranId: searchParams.get('tahunAjaranId') ?? '',
                    semesterAjaranId: newValue.target.value,
                    guruId: searchParams.get('guruId') ?? '',
                  })
                },
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <StaticSelect
              label='Guru'
              options={[
                { value: '', label: 'Semua' },
                ...loader.gurus.map(item => ({ value: item.id, label: DBHelpers.akun.getDisplayName(item) })),
              ]}
              selectProps={{
                value: searchParams.get('guruId') ?? '',
                onChange: newValue => {
                  handlePageChange({
                    newPage: loader.mataPelajarans.pagination.page,
                    tahunAjaranId: searchParams.get('tahunAjaranId') ?? '',
                    guruId: newValue.target.value,
                  })
                },
              }}
            />
          </FilterGridItem>
        </div>
      </Card>
      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        columns={[
          { field: 'nama', label: 'Nama' },
          {
            field: 'tahunAjaran',
            label: 'Tahun Ajaran',
            render: row => row.semesterAjaran.tahunAjaran.nama,
          },
          {
            field: 'semesterAjaran',
            label: 'Semester Ajaran',
            render: row => EnumsTitleUtils.getSemesterAjaranUrutan(row.semesterAjaran.urutan as SemesterAjaranUrutan),
          },
          {
            field: 'guru',
            label: 'Guru',
            render: row => (row.guru ? DBHelpers.akun.getDisplayName(row.guru) : '-'),
          },
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
            field: 'deletedAt',
            label: 'Deleted At',
            render: row => (row.deletedAt ? dateFns.format(row.deletedAt, constants.dateFormats.dateColumn) : '-'),
          },
          {
            field: 'actions',
            label: 'Aksi',
            render: row => (
              <DataGridActionButtonWrapper>
                <Link to={AppNav.admin.masterMataPelajaranEdit({ id: row.id })}>
                  <DataGridActionButton
                    icon={DataGridActionButtonHelper.getEditIcon()}
                    color='warning'
                    buttonProps={{ disabled: !!row.deletedAt }}
                  />
                </Link>
                <DataGridActionButton
                  icon={DataGridActionButtonHelper.getDeleteIcon()}
                  color='error'
                  buttonProps={{ disabled: !!row.deletedAt, onClick: () => openDeletePopup(row) }}
                />
              </DataGridActionButtonWrapper>
            ),
          },
        ]}
        rows={loader.mataPelajarans.data}
        pagination={{
          page: loader.mataPelajarans.pagination.page,
          pageSize: loader.mataPelajarans.pagination.limit,
          total: loader.mataPelajarans.pagination.total,
          totalPages: loader.mataPelajarans.pagination.totalPages,
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='shadow-primary'
      />
    </AdminPageContainer>
  )
}
