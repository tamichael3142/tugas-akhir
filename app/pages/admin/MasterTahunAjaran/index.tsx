import { TahunAjaran } from '@prisma/client'
import { Link, useFetcher, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import * as dateFns from 'date-fns'
import { Fragment, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import { MdCalendarMonth } from 'react-icons/md'
import { Button } from '~/components/forms'
import { DataGrid, LoadingFullScreen } from '~/components/ui'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import constants from '~/constants'
import { usePopup } from '~/hooks/usePopup'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { ActionDataAdminMasterTahunAjaranDelete } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterTahunAjaran } from '~/types/loaders-data/admin'

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
      title: 'Delete academic year?',
      onClose: popup.close,
      content: (
        <Fragment>
          <p>
            Are you sure to delete this academic year: <span className='font-semibold text-red-500'>{row.nama}</span>?
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
      title='Master Academic Year'
      actions={[
        <Link key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterTahunAjaranCreate()}>
          <Button label='Add' startIcon={<FaPlus />} onlyIconOnSmallView />
        </Link>,
      ]}
    >
      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        columns={[
          {
            field: 'tahunMulai',
            label: 'Start Year',
            render: row => dateFns.format(row.tahunMulai, constants.dateFormats.yearFull),
          },
          {
            field: 'tahunBerakhir',
            label: 'End Year',
            render: row => dateFns.format(row.tahunBerakhir, constants.dateFormats.yearFull),
          },
          { field: 'nama', label: 'Label' },
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
            label: 'Action',
            render: row => (
              <DataGridActionButtonWrapper>
                <Link to={AppNav.admin.masterTahunAjaranManageAcademicCalendar({ id: row.id })}>
                  <DataGridActionButton
                    icon={<MdCalendarMonth />}
                    color='info'
                    label='Manage Academic Calendar'
                    buttonProps={{ disabled: !!row.deletedAt }}
                  />
                </Link>
                <Link to={AppNav.admin.masterTahunAjaranEdit({ id: row.id })}>
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
