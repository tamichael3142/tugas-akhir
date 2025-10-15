import { Link, useFetcher, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { FaPlus } from 'react-icons/fa'
import { Button } from '~/components/forms'
import { DataGrid, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { LoaderDataAdminMasterTahunAjaran } from '~/types/loaders-data/admin'
import * as dateFns from 'date-fns'
import constants from '~/constants'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import { usePopup } from '~/hooks/usePopup'
import { TahunAjaran } from '@prisma/client'
import { Fragment } from 'react/jsx-runtime'
import { useEffect } from 'react'
import { ActionDataAdminMasterTahunAjaranDelete } from '~/types/actions-data/admin'

const sectionPrefix = 'admin-master-tahunAjaran'
const deleteFormId = `${sectionPrefix}-delete-form`

export default function AdminMasterTahunAjaranPage() {
  const loader = useLoaderData<LoaderDataAdminMasterTahunAjaran>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fetcher = useFetcher<ActionDataAdminMasterTahunAjaranDelete>({ key: deleteFormId })
  const revalidator = useRevalidator()
  const popup = usePopup()

  const isDeleting = fetcher.state === 'submitting'
  const isSuccess = fetcher.data?.success

  useEffect(() => {
    if (isSuccess) {
      fetcher.load(AppNav.admin.masterTahunAjaran())
      revalidator.revalidate() // refresh data loader parent
      popup.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, revalidator])

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    navigate(`?${params.toString()}`, { replace: false })
  }

  function openDeletePopup(row: TahunAjaran) {
    popup.open({
      title: 'Hapus tahun ajaran?',
      onClose: popup.close,
      content: (
        <Fragment>
          <p>
            Apakah anda yakin untuk menghapus tahun ajaran{' '}
            <span className='font-semibold text-red-500'>{row.nama}</span>?
          </p>
          <fetcher.Form
            id={deleteFormId}
            method='delete'
            action={AppNav.adminAction.masterTahunAjaranDelete({ tahunAjaranId: row.id })}
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
      title='Master Tahun Ajaran'
      actions={[
        <Link key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterTahunAjaranCreate()}>
          <Button label='Tambah' startIcon={<FaPlus />} onlyIconOnSmallView />
        </Link>,
      ]}
    >
      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        columns={[
          { field: 'nama', label: 'Nama' },
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
                <Link to={AppNav.admin.masterTahunAjaranEdit({ id: row.id })}>
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
        rows={loader.tahunAjarans.data}
        pagination={{
          page: loader.tahunAjarans.pagination.page,
          pageSize: loader.tahunAjarans.pagination.limit,
          total: loader.tahunAjarans.pagination.total,
          totalPages: loader.tahunAjarans.pagination.totalPages,
          onPageChange: handlePageChange,
        }}
        className='shadow-primary'
      />
    </AdminPageContainer>
  )
}
