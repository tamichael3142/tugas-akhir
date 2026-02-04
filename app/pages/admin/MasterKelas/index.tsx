import { Link, useFetcher, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { FaPlus } from 'react-icons/fa'
import { Button, StaticSelect } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { LoaderDataAdminMasterKelas } from '~/types/loaders-data/admin'
import * as dateFns from 'date-fns'
import constants from '~/constants'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import { usePopup } from '~/hooks/usePopup'
import { Kelas, SemesterAjaranUrutan } from '@prisma/client'
import { Fragment } from 'react/jsx-runtime'
import { ReactNode, useEffect } from 'react'
import { ActionDataAdminMasterKelasDelete } from '~/types/actions-data/admin'
import DBHelpers from '~/database/helpers'
import { PiStudent } from 'react-icons/pi'

const sectionPrefix = 'admin-master-kelas'
const deleteFormId = `${sectionPrefix}-delete-form`

export default function AdminMasterKelasPage() {
  const loader = useLoaderData<LoaderDataAdminMasterKelas>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fetcher = useFetcher<ActionDataAdminMasterKelasDelete>({ key: deleteFormId })
  const revalidator = useRevalidator()
  const popup = usePopup()

  const isDeleting = fetcher.state === 'submitting'
  const isSuccess = fetcher.data?.success

  useEffect(() => {
    if (isSuccess) {
      fetcher.load(AppNav.admin.masterKelas())
      revalidator.revalidate() // refresh data loader parent
      popup.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, revalidator])

  function handlePageChange({
    newPage,
    tahunAjaranId,
    waliId,
  }: {
    newPage: number
    tahunAjaranId?: string
    waliId?: string
  }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (tahunAjaranId) params.set('tahunAjaranId', tahunAjaranId)
    else params.delete('tahunAjaranId')
    if (waliId) params.set('waliId', waliId)
    else params.delete('waliId')
    navigate(`?${params.toString()}`, { replace: false })
  }

  function openDeletePopup(row: Kelas) {
    popup.open({
      title: 'Hapus kelas?',
      onClose: popup.close,
      content: (
        <Fragment>
          <p>
            Apakah anda yakin untuk menghapus kelas <span className='font-semibold text-red-500'>{row.nama}</span>?
          </p>
          <fetcher.Form
            id={deleteFormId}
            method='delete'
            action={AppNav.adminAction.masterKelasDelete({ kelasId: row.id })}
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
      title='Master Kelas'
      actions={[
        <Link key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterKelasCreate()}>
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
                    newPage: loader.kelass.pagination.page,
                    tahunAjaranId: newValue.target.value,
                    waliId: searchParams.get('waliId') ?? '',
                  })
                },
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <StaticSelect
              label='Wali Kelas'
              options={[
                { value: '', label: 'Semua' },
                ...loader.waliKelass.map(item => ({ value: item.id, label: DBHelpers.akun.getDisplayName(item) })),
              ]}
              selectProps={{
                value: searchParams.get('waliId') ?? '',
                onChange: newValue => {
                  handlePageChange({
                    newPage: loader.kelass.pagination.page,
                    tahunAjaranId: searchParams.get('tahunAjaranId') ?? '',
                    waliId: newValue.target.value,
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
          { field: 'tahunAjaran', label: 'Tahun Ajaran', render: row => row.tahunAjaran.nama },
          {
            field: 'wali',
            label: 'Wali Kelas',
            render: row => (row.wali ? DBHelpers.akun.getDisplayName(row.wali) : '-'),
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
            render: row => {
              const semesterSatu = row.tahunAjaran.semesterAjaran.find(
                item => item.urutan === SemesterAjaranUrutan.SATU,
              )
              const semesterDua = row.tahunAjaran.semesterAjaran.find(item => item.urutan === SemesterAjaranUrutan.DUA)

              return (
                <DataGridActionButtonWrapper>
                  <Link
                    to={`${AppNav.admin.masterKelasManageSiswa({ id: row.id })}?semesterAjaranId=${semesterSatu?.id}`}
                  >
                    <DataGridActionButton icon={<PiStudent />} color='info' label={'Manage Siswa'} />
                  </Link>
                  {semesterSatu ? (
                    <Link to={AppNav.admin.masterKelasManageJadwal({ id: row.id, semesterAjaranId: semesterSatu.id })}>
                      <DataGridActionButton
                        icon={DataGridActionButtonHelper.getManageIcon()}
                        color='success'
                        label={'Jadwal Semester 1'}
                        buttonProps={{ disabled: !!row.deletedAt }}
                      />
                    </Link>
                  ) : null}
                  {semesterDua ? (
                    <Link to={AppNav.admin.masterKelasManageJadwal({ id: row.id, semesterAjaranId: semesterDua.id })}>
                      <DataGridActionButton
                        icon={DataGridActionButtonHelper.getManageIcon()}
                        color='success'
                        label={'Jadwal Semester 2'}
                        buttonProps={{ disabled: !!row.deletedAt }}
                      />
                    </Link>
                  ) : null}
                  <Link to={AppNav.admin.masterKelasEdit({ id: row.id })}>
                    <DataGridActionButton
                      icon={DataGridActionButtonHelper.getEditIcon()}
                      color='warning'
                      label={'Edit'}
                      buttonProps={{ disabled: !!row.deletedAt }}
                    />
                  </Link>
                  <DataGridActionButton
                    icon={DataGridActionButtonHelper.getDeleteIcon()}
                    color='error'
                    label={'Delete'}
                    buttonProps={{ disabled: !!row.deletedAt, onClick: () => openDeletePopup(row) }}
                  />
                </DataGridActionButtonWrapper>
              )
            },
          },
        ]}
        rows={loader.kelass.data}
        pagination={{
          page: loader.kelass.pagination.page,
          pageSize: loader.kelass.pagination.limit,
          total: loader.kelass.pagination.total,
          totalPages: loader.kelass.pagination.totalPages,
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='shadow-primary'
      />
    </AdminPageContainer>
  )
}
