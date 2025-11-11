import { Link, useFetcher, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { FaPlus } from 'react-icons/fa'
import { Button, StaticSelect } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { LoaderDataAdminMasterEkstrakulikuler } from '~/types/loaders-data/admin'
import * as dateFns from 'date-fns'
import constants from '~/constants'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import { usePopup } from '~/hooks/usePopup'
import { Ekstrakulikuler } from '@prisma/client'
import { Fragment } from 'react/jsx-runtime'
import { ReactNode, useEffect } from 'react'
import { ActionDataAdminMasterEkstrakulikulerDelete } from '~/types/actions-data/admin'
import DBHelpers from '~/database/helpers'

const sectionPrefix = 'admin-master-ekstrakulikuler'
const deleteFormId = `${sectionPrefix}-delete-form`

export default function AdminMasterEkstrakulikulerPage() {
  const loader = useLoaderData<LoaderDataAdminMasterEkstrakulikuler>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fetcher = useFetcher<ActionDataAdminMasterEkstrakulikulerDelete>({ key: deleteFormId })
  const revalidator = useRevalidator()
  const popup = usePopup()

  const isDeleting = fetcher.state === 'submitting'
  const isSuccess = fetcher.data?.success

  useEffect(() => {
    if (isSuccess) {
      fetcher.load(AppNav.admin.masterEkstrakulikuler())
      revalidator.revalidate() // refresh data loader parent
      popup.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, revalidator])

  function handlePageChange({
    newPage,
    tahunAjaranId,
    pengajarId,
  }: {
    newPage: number
    tahunAjaranId?: string
    pengajarId?: string
  }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (tahunAjaranId) params.set('tahunAjaranId', tahunAjaranId)
    else params.delete('tahunAjaranId')
    if (pengajarId) params.set('pengajarId', pengajarId)
    else params.delete('pengajarId')
    navigate(`?${params.toString()}`, { replace: false })
  }

  function openDeletePopup(row: Ekstrakulikuler) {
    popup.open({
      title: 'Hapus ekstrakulikuler?',
      onClose: popup.close,
      content: (
        <Fragment>
          <p>
            Apakah anda yakin untuk menghapus ekstrakulikuler{' '}
            <span className='font-semibold text-red-500'>{row.nama}</span>?
          </p>
          <fetcher.Form
            id={deleteFormId}
            method='delete'
            action={AppNav.adminAction.masterEkstrakulikulerDelete({ ekstrakulikulerId: row.id })}
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
      title='Master Ekstrakulikuler'
      actions={[
        <Link key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterEkstrakulikulerCreate()}>
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
                    newPage: loader.ekstrakulikulers.pagination.page,
                    tahunAjaranId: newValue.target.value,
                  })
                },
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <StaticSelect
              label='Pengajar'
              options={[
                { value: '', label: 'Semua' },
                ...loader.pengajars.map(item => ({ value: item.id, label: DBHelpers.akun.getDisplayName(item) })),
              ]}
              selectProps={{
                value: searchParams.get('pengajarId') ?? '',
                onChange: newValue => {
                  handlePageChange({
                    newPage: loader.ekstrakulikulers.pagination.page,
                    tahunAjaranId: searchParams.get('tahunAjaranId') ?? '',
                    pengajarId: newValue.target.value,
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
          { field: 'ruangan', label: 'Ruangan' },
          { field: 'tahunAjaran', label: 'Tahun Ajaran', render: row => row.tahunAjaran.nama },
          {
            field: 'pengajar',
            label: 'Pengajar',
            render: row => (row.pengajar ? DBHelpers.akun.getDisplayName(row.pengajar) : '-'),
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
                <Link to={AppNav.admin.masterEkstrakulikulerEdit({ id: row.id })}>
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
        rows={loader.ekstrakulikulers.data}
        pagination={{
          page: loader.ekstrakulikulers.pagination.page,
          pageSize: loader.ekstrakulikulers.pagination.limit,
          total: loader.ekstrakulikulers.pagination.total,
          totalPages: loader.ekstrakulikulers.pagination.totalPages,
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='shadow-primary'
      />
    </AdminPageContainer>
  )
}
