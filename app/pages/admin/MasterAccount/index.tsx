import { Link, useFetcher, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { FaPlus } from 'react-icons/fa'
import { CgExport } from 'react-icons/cg'
import { Button, Checkbox } from '~/components/forms'
import { DataGrid, LoadingFullScreen } from '~/components/ui'
import { Role } from '~/database/enums/prisma.enums'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { LoaderDataAdminMasterAkun } from '~/types/loaders-data/admin'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import * as dateFns from 'date-fns'
import constants from '~/constants'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import { usePopup } from '~/hooks/usePopup'
import { Akun } from '@prisma/client'
import DBHelpers from '~/database/helpers'
import { Fragment } from 'react/jsx-runtime'
import { useEffect, useState } from 'react'
import { ActionDataAdminMasterAccountDelete } from '~/types/actions-data/admin'
import XLSXUtils from '~/utils/xlsx.utils'
import { IoMdClose } from 'react-icons/io'

const sectionPrefix = 'admin-master-account'
const deleteFormId = `${sectionPrefix}-delete-form`

export default function AdminMasterAccountPage() {
  const loader = useLoaderData<LoaderDataAdminMasterAkun>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fetcher = useFetcher<ActionDataAdminMasterAccountDelete>({ key: deleteFormId })
  const revalidator = useRevalidator()
  const popup = usePopup()

  const isDeleting = fetcher.state === 'submitting'
  const isSuccess = fetcher.data?.success

  const [selectedIds, setSelectedIds] = useState<Akun['id'][]>([])

  function downloadExportIds() {
    if (selectedIds.length) {
      XLSXUtils.downloadExcelFromIds({
        ids: selectedIds,
        fileName: `export-account-id-${new Date().toTimeString()}.xlsx`,
      })
    }
  }

  useEffect(() => {
    if (isSuccess) {
      fetcher.load(AppNav.admin.masterAccount())
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

  function openDeletePopup(row: Akun) {
    popup.open({
      title: 'Hapus akun?',
      onClose: popup.close,
      content: (
        <Fragment>
          <p>
            Apakah anda yakin untuk menghapus akun{' '}
            <span className='font-semibold text-red-500'>{DBHelpers.akun.getDisplayName(row)}</span>?
          </p>
          <fetcher.Form
            id={deleteFormId}
            method='delete'
            action={AppNav.adminAction.masterAccountDelete({ akunId: row.id })}
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
      title='Master Account'
      actions={[
        <Button
          key={`${sectionPrefix}-export-button`}
          label={`Export ID${selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}`}
          color='secondary'
          startIcon={<CgExport />}
          onlyIconOnSmallView
          buttonProps={{ onClick: downloadExportIds, disabled: selectedIds.length <= 0 }}
        />,
        <Link key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterAccountCreate()}>
          <Button label='Tambah' startIcon={<FaPlus />} onlyIconOnSmallView />
        </Link>,
      ]}
    >
      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        columns={[
          {
            field: 'checkbox',
            label: (
              <div className='flex items-center justify-center'>
                <DataGridActionButton
                  icon={<IoMdClose />}
                  buttonProps={{ disabled: selectedIds.length <= 0, onClick: () => setSelectedIds([]) }}
                />
              </div>
            ),
            render: row => (
              <div className='flex items-center justify-center'>
                <Checkbox
                  inputProps={{
                    checked: selectedIds.includes(row.id),
                    onChange: e =>
                      setSelectedIds(oldValues => {
                        let newValues: Akun['id'][] = []
                        if (e.target.checked && !oldValues.includes(row.id)) newValues = [...oldValues, row.id]
                        else newValues = oldValues.filter(item => item !== row.id)

                        return newValues
                      }),
                  }}
                />
              </div>
            ),
          },
          { field: 'username', label: 'Username' },
          { field: 'role', label: 'Role', render: row => EnumsTitleUtils.getRole(row.role as Role) },
          { field: 'firstName', label: 'Nama Depan' },
          { field: 'lastName', label: 'Nama Belakang' },
          { field: 'email', label: 'Email' },
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
                <Link to={AppNav.admin.masterAccountEdit({ id: row.id })}>
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
            ),
          },
        ]}
        rows={loader.akuns.data}
        pagination={{
          page: loader.akuns.pagination.page,
          pageSize: loader.akuns.pagination.limit,
          total: loader.akuns.pagination.total,
          totalPages: loader.akuns.pagination.totalPages,
          onPageChange: handlePageChange,
        }}
        className='shadow-primary'
      />
    </AdminPageContainer>
  )
}
