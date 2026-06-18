import { AcademicCalendarEvent } from '@prisma/client'
import { Link, useFetcher, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import * as dateFns from 'date-fns'
import { Fragment, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaPlus } from 'react-icons/fa'
import { Button } from '~/components/forms'
import { BackButton, DataGrid, LoadingFullScreen } from '~/components/ui'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import constants from '~/constants'
import { usePopup } from '~/hooks/usePopup'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { ActionDataAdminMasterTahunAjaranAcademicCalendarEventDelete } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterTahunAjaranManageAcademicCalendar } from '~/types/loaders-data/admin'

const sectionPrefix = 'admin-manage-academic-calendar'
const deleteFormId = `${sectionPrefix}-delete-form`

export default function AdminMasterTahunAjaranManageAcademicCalendarPage() {
  const loader = useLoaderData<LoaderDataAdminMasterTahunAjaranManageAcademicCalendar>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const revalidator = useRevalidator()
  const popup = usePopup()

  const deleteFetcher = useFetcher<ActionDataAdminMasterTahunAjaranAcademicCalendarEventDelete>({
    key: deleteFormId,
  })

  const isDeleting = deleteFetcher.state === 'submitting'
  const isDeleteSuccess = deleteFetcher.data?.success

  useEffect(() => {
    if (isDeleteSuccess) {
      revalidator.revalidate()
      popup.close()
      toast.success(deleteFetcher.data?.message ?? 'Event deleted!')
    } else if (deleteFetcher.data?.success === false) {
      toast.error(deleteFetcher.data.message ?? 'Failed to delete event.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteSuccess, deleteFetcher.data])

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    navigate(`?${params.toString()}`, { replace: false })
  }

  function openDeletePopup(row: AcademicCalendarEvent) {
    popup.open({
      title: 'Delete academic calendar event?',
      onClose: popup.close,
      content: (
        <Fragment>
          <p>
            Are you sure to delete: <span className='font-semibold text-red-500'>{row.title}</span>?
          </p>
          <deleteFetcher.Form
            id={deleteFormId}
            method='delete'
            action={AppNav.adminAction.academicCalendarEventDelete({
              tahunAjaranId: row.tahunAjaranId,
              eventId: row.id,
            })}
          />
        </Fragment>
      ),
      actionButtons: [
        { label: 'Cancel', color: 'secondary', variant: 'text', buttonProps: { onClick: popup.close } },
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
      title={`Academic Calendar (Year: ${loader.tahunAjaran?.nama ?? ''})`}
      actions={[
        <Link
          key={`${sectionPrefix}-add-button`}
          to={AppNav.admin.masterTahunAjaranManageAcademicCalendarCreate({
            tahunAjaranId: loader.tahunAjaran?.id ?? '',
          })}
        >
          <Button label='Add Event' color='secondary' startIcon={<FaPlus />} onlyIconOnSmallView />
        </Link>,
        <BackButton key={`${sectionPrefix}-back-button`} to={AppNav.admin.masterTahunAjaran()} />,
      ]}
    >
      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        columns={[
          { field: 'title', label: 'Title' },
          { field: 'description', label: 'Description', render: row => row.description ?? '-' },
          {
            field: 'startDate',
            label: 'Start Date',
            render: row => dateFns.format(row.startDate, constants.dateFormats.displayCompactDate1),
          },
          {
            field: 'endDate',
            label: 'End Date',
            render: row => dateFns.format(row.endDate, constants.dateFormats.displayCompactDate1),
          },
          {
            field: 'actions',
            label: 'Action',
            render: row => (
              <DataGridActionButtonWrapper>
                <Link
                  to={AppNav.admin.masterTahunAjaranManageAcademicCalendarEdit({
                    tahunAjaranId: row.tahunAjaranId,
                    eventId: row.id,
                  })}
                >
                  <DataGridActionButton icon={DataGridActionButtonHelper.getEditIcon()} color='warning' label='Edit' />
                </Link>
                <DataGridActionButton
                  icon={DataGridActionButtonHelper.getDeleteIcon()}
                  color='error'
                  label='Delete'
                  buttonProps={{ onClick: () => openDeletePopup(row) }}
                />
              </DataGridActionButtonWrapper>
            ),
          },
        ]}
        rows={loader.academicCalendarEvents.data}
        pagination={{
          page: loader.academicCalendarEvents.pagination.page,
          pageSize: loader.academicCalendarEvents.pagination.limit,
          total: loader.academicCalendarEvents.pagination.total,
          totalPages: loader.academicCalendarEvents.pagination.totalPages,
          onPageChange: handlePageChange,
        }}
        className='shadow-primary'
      />
    </AdminPageContainer>
  )
}
