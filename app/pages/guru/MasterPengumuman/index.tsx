import { Link, useFetcher, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { FaPlus } from 'react-icons/fa'
import { Button } from '~/components/forms'
import { DataGrid, LoadingFullScreen } from '~/components/ui'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import AppNav from '~/navigation'
import { LoaderDataGuruMasterPengumuman } from '~/types/loaders-data/guru'
import * as dateFns from 'date-fns'
import constants from '~/constants'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import { usePopup } from '~/hooks/usePopup'
import { Pengumuman } from '@prisma/client'
import { Fragment } from 'react/jsx-runtime'
import { useEffect } from 'react'
import { ActionDataGuruMasterPengumumanDelete } from '~/types/actions-data/guru'
import useAuthStore from '~/store/authStore'
import DBHelpers from '~/database/helpers'

const sectionPrefix = 'guru-master-pengumuman'
const deleteFormId = `${sectionPrefix}-delete-form`

export default function GuruMasterPengumumanPage() {
  const loader = useLoaderData<LoaderDataGuruMasterPengumuman>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fetcher = useFetcher<ActionDataGuruMasterPengumumanDelete>({ key: deleteFormId })
  const revalidator = useRevalidator()
  const popup = usePopup()
  const user = useAuthStore(state => state.user)

  const isDeleting = fetcher.state === 'submitting'
  const isSuccess = fetcher.data?.success

  useEffect(() => {
    if (isSuccess) {
      fetcher.load(AppNav.guru.masterPengumuman())
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

  function openDeletePopup(row: Pengumuman) {
    popup.open({
      title: 'Hapus pengumuman?',
      onClose: popup.close,
      content: (
        <Fragment>
          <p>
            Apakah anda yakin untuk menghapus pengumuman <span className='font-semibold text-red-500'>{row.nama}</span>?
          </p>
          <fetcher.Form
            id={deleteFormId}
            method='delete'
            action={AppNav.guruAction.masterPengumumanDelete({ pengumumanId: row.id })}
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
    <GuruPageContainer
      title='Master Pengumuman'
      actions={[
        <Link key={`${sectionPrefix}-add-button`} to={AppNav.guru.masterPengumumanCreate()}>
          <Button label='Tambah' startIcon={<FaPlus />} onlyIconOnSmallView />
        </Link>,
      ]}
    >
      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        columns={[
          { field: 'nama', label: 'Nama' },
          { field: 'content', label: 'Konten' },
          {
            field: 'createdBy',
            label: 'Pembuat',
            render: row => (row.createdBy ? DBHelpers.akun.getDisplayName(row.createdBy) : '-'),
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
              const mutable = user?.id === row.createdById

              return (
                <DataGridActionButtonWrapper>
                  <Link to={AppNav.guru.masterPengumumanEdit({ id: row.id })}>
                    <DataGridActionButton
                      icon={DataGridActionButtonHelper.getEditIcon()}
                      color='warning'
                      label={'Edit'}
                      buttonProps={{ disabled: !!row.deletedAt || !mutable }}
                    />
                  </Link>
                  <DataGridActionButton
                    icon={DataGridActionButtonHelper.getDeleteIcon()}
                    color='error'
                    label={'Delete'}
                    buttonProps={{ disabled: !!row.deletedAt || !mutable, onClick: () => openDeletePopup(row) }}
                  />
                </DataGridActionButtonWrapper>
              )
            },
          },
        ]}
        rows={loader.pengumumans.data}
        pagination={{
          page: loader.pengumumans.pagination.page,
          pageSize: loader.pengumumans.pagination.limit,
          total: loader.pengumumans.pagination.total,
          totalPages: loader.pengumumans.pagination.totalPages,
          onPageChange: handlePageChange,
        }}
        className='shadow-primary'
      />
    </GuruPageContainer>
  )
}
