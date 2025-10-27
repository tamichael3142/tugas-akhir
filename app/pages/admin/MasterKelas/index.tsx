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
import { Kelas } from '@prisma/client'
import { Fragment } from 'react/jsx-runtime'
import { useEffect } from 'react'
import { ActionDataAdminMasterKelasDelete } from '~/types/actions-data/admin'

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

  function handlePageChange({ newPage, tahunAjaranId }: { newPage: number; tahunAjaranId?: string }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (tahunAjaranId) params.set('tahunAjaranId', tahunAjaranId)
    else params.delete('tahunAjaranId')
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
        <StaticSelect
          label='Tahun Ajaran'
          options={[
            { value: '', label: 'Pilih tahun ajaran...' },
            ...loader.tahunAjarans.map(item => ({ value: item.id, label: item.nama })),
          ]}
          selectProps={{
            value: searchParams.get('tahunAjaranId') ?? '',
            onChange: newValue => {
              handlePageChange({ newPage: loader.kelass.pagination.page, tahunAjaranId: newValue.target.value })
            },
          }}
        />
      </Card>
      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        columns={[
          { field: 'nama', label: 'Nama' },
          { field: 'tahunAjaran', label: 'Tahun Ajaran', render: row => row.tahunAjaran.nama },
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
                <Link to={AppNav.admin.masterKelasEdit({ id: row.id })}>
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
