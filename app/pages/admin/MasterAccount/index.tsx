import { Link, useFetcher, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { FaPlus } from 'react-icons/fa'
import { CgExport } from 'react-icons/cg'
import { Button, Checkbox, StaticSelect } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
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
import { Fragment, ReactNode, useEffect, useState } from 'react'
import { ActionDataAdminMasterAccountDelete } from '~/types/actions-data/admin'
import XLSXUtils from '~/utils/xlsx.utils'
import { IoMdClose } from 'react-icons/io'
import { FaHandsHoldingChild } from 'react-icons/fa6'

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

  const [selectedAkuns, setSelectedAkuns] = useState<Akun[]>([])

  function downloadExportIds() {
    if (selectedAkuns.length) {
      XLSXUtils.downloadExcelFromAkun({
        akuns: selectedAkuns,
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

  function handlePageChange({ newPage, role }: { newPage: number; role?: Role }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (role) params.set('role', role)
    else params.delete('role')
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

  function FilterGridItem({ children }: { children?: ReactNode }) {
    return <div className='col-span-3 md:col-span-1'>{children}</div>
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <AdminPageContainer
      title='Master Account'
      actions={[
        <Button
          key={`${sectionPrefix}-export-button`}
          label={`Export ID${selectedAkuns.length > 0 ? ` (${selectedAkuns.length})` : ''}`}
          color='secondary'
          startIcon={<CgExport />}
          onlyIconOnSmallView
          buttonProps={{ onClick: downloadExportIds, disabled: selectedAkuns.length <= 0 }}
        />,
        <Link key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterAccountCreate()}>
          <Button label='Tambah' startIcon={<FaPlus />} onlyIconOnSmallView />
        </Link>,
      ]}
    >
      <Card className='mb-8 shadow-lg'>
        <div className='grid grid-cols-3 gap-4'>
          <FilterGridItem>
            <StaticSelect
              label='Role'
              options={[
                { value: '', label: 'Semua' },
                ...Object.values(Role).map(item => ({ value: item, label: EnumsTitleUtils.getRole(item) })),
              ]}
              selectProps={{
                value: searchParams.get('role') ?? '',
                onChange: newValue => {
                  handlePageChange({
                    newPage: loader.akuns.pagination.page,
                    role: (newValue.target.value ?? undefined) as Role,
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
          {
            field: 'checkbox',
            label: (
              <div className='flex items-center justify-center'>
                <DataGridActionButton
                  icon={<IoMdClose />}
                  buttonProps={{ disabled: selectedAkuns.length <= 0, onClick: () => setSelectedAkuns([]) }}
                />
              </div>
            ),
            render: row => {
              const existing = !!selectedAkuns.find(item => item.id === row.id)

              return (
                <div className='flex items-center justify-center'>
                  <Checkbox
                    inputProps={{
                      checked: existing,
                      onChange: e =>
                        setSelectedAkuns(oldValues => {
                          let newValues: Akun[] = []
                          if (e.target.checked && !existing) newValues = [...oldValues, row]
                          else newValues = oldValues.filter(item => item.id !== row.id)

                          return newValues
                        }),
                    }}
                  />
                </div>
              )
            },
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
                {row.role === Role.ORANGTUA ? (
                  <DataGridActionButton
                    icon={<FaHandsHoldingChild />}
                    color='primary'
                    label={'Manage Children'}
                    buttonProps={{
                      disabled: row.role !== Role.ORANGTUA,
                      onClick: () =>
                        navigate(
                          AppNav.admin.masterAccountManageChildren({
                            id: row.id,
                          }),
                        ),
                    }}
                  />
                ) : null}
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
          onPageChange: page => handlePageChange({ newPage: page, role: searchParams.get('role') as Role }),
        }}
        className='shadow-primary'
      />
    </AdminPageContainer>
  )
}
