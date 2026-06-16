import { Link, useFetcher, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react'
import { FaPlus } from 'react-icons/fa'
import { Button } from '~/components/forms'
import { DataGrid, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { LoaderDataAdminImportExcelTemplate } from '~/types/loaders-data/admin'
import * as dateFns from 'date-fns'
import constants from '~/constants'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import { usePopup } from '~/hooks/usePopup'
import { ImportExcelTemplate } from '@prisma/client'
import { Fragment, useEffect } from 'react'
import { ActionDataAdminImportExcelTemplateDelete } from '~/types/actions-data/admin'
import { SYSTEM_IMPORT_EXCEL_TEMPLATE_IDS } from './form-types'

const sectionPrefix = 'admin-import-excel-template'
const deleteFormId = `${sectionPrefix}-delete-form`

export default function AdminImportExcelTemplatePage() {
  const loader = useLoaderData<LoaderDataAdminImportExcelTemplate>()
  const navigate = useNavigate()
  const fetcher = useFetcher<ActionDataAdminImportExcelTemplateDelete>({ key: deleteFormId })
  const revalidator = useRevalidator()
  const popup = usePopup()

  const isDeleting = fetcher.state === 'submitting'
  const isSuccess = fetcher.data?.success

  useEffect(() => {
    if (isSuccess) {
      fetcher.load(AppNav.admin.importExcelTemplate())
      revalidator.revalidate()
      popup.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, revalidator])

  function handlePageChange({ newPage }: { newPage: number }) {
    navigate(`?page=${newPage}`, { replace: false })
  }

  function openDeletePopup(row: ImportExcelTemplate) {
    popup.open({
      title: 'Delete import template?',
      onClose: popup.close,
      content: (
        <Fragment>
          <p>
            Are you sure to delete template <span className='font-semibold text-red-500'>{row.title}</span>?
          </p>
          <fetcher.Form
            id={deleteFormId}
            method='delete'
            action={AppNav.adminAction.importExcelTemplateDelete({ importExcelTemplateId: row.id })}
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
      title='Import Excel Templates'
      actions={[
        <Link key={`${sectionPrefix}-add-button`} to={AppNav.admin.importExcelTemplateCreate()}>
          <Button label='Add' startIcon={<FaPlus />} onlyIconOnSmallView />
        </Link>,
      ]}
    >
      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        columns={[
          { field: 'id', label: 'ID' },
          { field: 'title', label: 'Title' },
          { field: 'remark', label: 'Remark', render: row => row.remark ?? '-' },
          {
            field: 'download',
            label: 'Download',
            render: row =>
              row.downloadUrl ? (
                <a href={row.downloadUrl} target='_blank' rel='noreferrer' className='hover:text-primary'>
                  Download
                </a>
              ) : (
                '-'
              ),
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
            field: 'actions',
            label: 'Action',
            render: row => (
              <DataGridActionButtonWrapper>
                <Link to={AppNav.admin.importExcelTemplateEdit({ id: row.id })}>
                  <DataGridActionButton icon={DataGridActionButtonHelper.getEditIcon()} color='warning' label='Edit' />
                </Link>
                <DataGridActionButton
                  icon={DataGridActionButtonHelper.getDeleteIcon()}
                  color='error'
                  label='Delete'
                  buttonProps={{
                    onClick: () => openDeletePopup(row),
                    disabled: (SYSTEM_IMPORT_EXCEL_TEMPLATE_IDS as readonly string[]).includes(row.id),
                  }}
                />
              </DataGridActionButtonWrapper>
            ),
          },
        ]}
        rows={loader.importExcelTemplates.data}
        pagination={{
          page: loader.importExcelTemplates.pagination.page,
          pageSize: loader.importExcelTemplates.pagination.limit,
          total: loader.importExcelTemplates.pagination.total,
          totalPages: loader.importExcelTemplates.pagination.totalPages,
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='shadow-primary'
      />
    </AdminPageContainer>
  )
}
