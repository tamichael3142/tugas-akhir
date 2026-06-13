import { Link, useFetcher, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { Fragment, ReactNode, useEffect, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import { Button, StaticSelect, TextInput } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import AppNav from '~/navigation'
import { LoaderDataGuruManageViolations } from '~/types/loaders-data/guru'
import { ActionDataGuruManageViolationsDelete } from '~/types/actions-data/guru'
import { format } from 'date-fns'
import constants from '~/constants'
import DBHelpers from '~/database/helpers'
import { usePopup } from '~/hooks/usePopup'
import useAuthStore from '~/store/authStore'
import { Akun, Kelas, MataPelajaran, PelanggaranPerMapel, Role } from '@prisma/client'

const sectionPrefix = 'guru-manage-violations'
const deleteFormId = `${sectionPrefix}-delete-form`

export default function GuruManageViolationsPage() {
  const loader = useLoaderData<LoaderDataGuruManageViolations>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const revalidator = useRevalidator()
  const user = useAuthStore(state => state.user)
  const popup = usePopup()
  const deleteFetcher = useFetcher<ActionDataGuruManageViolationsDelete>({ key: deleteFormId })

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

  const isDeleting = deleteFetcher.state === 'submitting'
  const isSuccessDelete = deleteFetcher.data?.success

  useEffect(() => {
    if (isSuccessDelete) {
      deleteFetcher.load(AppNav.guru.manageViolations())
      revalidator.revalidate() // refresh data loader parent
      popup.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete, revalidator])

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    params.set('page', '1')
    navigate(`?${params.toString()}`, { replace: false })
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    navigate(`?${params.toString()}`, { replace: false })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateParams({ search: searchText || undefined })
    }, 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  function FilterGridItem({ children }: { children?: ReactNode }) {
    return <div className='col-span-3 md:col-span-1'>{children}</div>
  }

  function openDeletePopup(row: PelanggaranPerMapel & { siswa: Akun; kelas: Kelas; mataPelajaran: MataPelajaran }) {
    popup.open({
      title: 'Delete Violation',
      onClose: popup.close,
      content: (
        <Fragment>
          <p>
            Are you sure you want to delete this violation record of{' '}
            <span className='font-semibold text-primary'>{DBHelpers.akun.getDisplayName(row.siswa)}</span>?
          </p>
          <p className='text-sm text-neutral-500'>This action cannot be undone.</p>
          <deleteFetcher.Form
            id={deleteFormId}
            method='delete'
            action={AppNav.guruAction.manageViolationsDelete({ pelanggaranId: row.id })}
          ></deleteFetcher.Form>
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
      title='Manage Violations'
      actions={[
        <Link key={`${sectionPrefix}-add-button`} to={AppNav.guru.manageViolationsCreate()}>
          <Button label='Add Violation' startIcon={<MdAdd />} onlyIconOnSmallView />
        </Link>,
      ]}
    >
      <Card className='mb-8 shadow-lg'>
        <div className='grid grid-cols-3 gap-4'>
          <FilterGridItem>
            <TextInput
              label='Search'
              inputProps={{
                placeholder: 'Search by student or description...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <StaticSelect
              label='Class'
              options={[
                { value: '', label: 'All classes' },
                ...loader.kelass.map(item => ({ value: item.id, label: item.nama })),
              ]}
              selectProps={{
                value: searchParams.get('kelasId') ?? '',
                onChange: e => updateParams({ kelasId: e.target.value || undefined }),
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <StaticSelect
              label='Subject'
              options={[
                { value: '', label: 'All subjects' },
                ...loader.mataPelajarans.map(item => ({ value: item.id, label: item.nama })),
              ]}
              selectProps={{
                value: searchParams.get('mataPelajaranId') ?? '',
                onChange: e => updateParams({ mataPelajaranId: e.target.value || undefined }),
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <TextInput
              label='From Date'
              inputProps={{
                type: 'date',
                value: searchParams.get('startDate') ?? '',
                onChange: e => updateParams({ startDate: e.target.value || undefined }),
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <TextInput
              label='To Date'
              inputProps={{
                type: 'date',
                value: searchParams.get('endDate') ?? '',
                onChange: e => updateParams({ endDate: e.target.value || undefined }),
              }}
            />
          </FilterGridItem>
        </div>
      </Card>
      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        columns={[
          { field: 'siswa', label: 'Student', render: row => DBHelpers.akun.getDisplayName(row.siswa) },
          { field: 'kelas', label: 'Class', render: row => row.kelas.nama },
          { field: 'mataPelajaran', label: 'Subject', render: row => row.mataPelajaran.nama },
          { field: 'remark', label: 'Description', render: row => row.remark || '-' },
          {
            field: 'createdAt',
            label: 'Violation Date',
            render: row => format(new Date(row.createdAt), constants.dateFormats.dateColumn),
          },
          { field: 'poin', label: 'Points' },
          {
            field: 'createdBy',
            label: 'Created By',
            render: row => (row.createdBy ? DBHelpers.akun.getDisplayName(row.createdBy) : '-'),
          },
          {
            field: 'actions',
            label: 'Action',
            render: row => {
              const isEditable = row.mataPelajaran.guruId === user?.id
              const isDeletable = user?.role === Role.ADMIN || user?.id === row.createdById

              return (
                <DataGridActionButtonWrapper>
                  <DataGridActionButton
                    icon={DataGridActionButtonHelper.getEditIcon()}
                    color='warning'
                    label={'Edit'}
                    buttonProps={{
                      disabled: !isEditable,
                      onClick: () => navigate(AppNav.guru.manageViolationsEdit({ pelanggaranId: row.id })),
                    }}
                  />
                  <DataGridActionButton
                    icon={DataGridActionButtonHelper.getDeleteIcon()}
                    color='error'
                    label={'Delete'}
                    buttonProps={{
                      disabled: !isDeletable,
                      onClick: () => openDeletePopup(row),
                    }}
                  />
                </DataGridActionButtonWrapper>
              )
            },
          },
        ]}
        rows={loader.pelanggarans.data}
        pagination={{
          page: loader.pelanggarans.pagination.page,
          pageSize: loader.pelanggarans.pagination.limit,
          total: loader.pelanggarans.pagination.total,
          totalPages: loader.pelanggarans.pagination.totalPages,
          onPageChange: handlePageChange,
        }}
        className='shadow-primary'
      />
    </GuruPageContainer>
  )
}
