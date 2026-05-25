import { Link, useFetcher, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { Fragment, useEffect, useState } from 'react'
import { Button, TextInput } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaran } from '~/types/loaders-data/guru'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import AppNav from '~/navigation'
import { format } from 'date-fns'
import { MdAdd } from 'react-icons/md'
import constants from '~/constants'
import GuruManageMataPelajaranDetailTab, { TabKey } from '../_components/Tab'
import useAuthStore from '~/store/authStore'
import DBHelpers from '~/database/helpers'
import { Role } from '~/database/enums/prisma.enums'
import { Akun, PelanggaranPerMapel } from '@prisma/client'
import { usePopup } from '~/hooks/usePopup'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranDelete } from '~/types/actions-data/guru'

const sectionPrefix = 'guru-daftar-kelas-detail-mata-pelajaran-detail-pelanggaran'
const deleteFormId = `${sectionPrefix}-delete-form`

export default function GuruDaftarKelasDetailMataPelajaranDetailPelanggaranPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaran>()
  const deleteFetcher = useFetcher<ActionDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranDelete>({
    key: deleteFormId,
  })
  const revalidator = useRevalidator()
  const user = useAuthStore(state => state.user)
  const popup = usePopup()

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')
  const isDeleting = deleteFetcher.state === 'submitting'
  const isSuccessDelete = deleteFetcher.data?.success

  useEffect(() => {
    if (isSuccessDelete) {
      deleteFetcher.load(
        AppNav.guru.daftarKelasDetailMataPelajaranDetailPelanggaran({
          kelasId: loader.kelas.id,
          mataPelajaranId: loader.mataPelajaran.id,
        }),
      )
      revalidator.revalidate() // refresh data loader parent
      popup.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete, revalidator])

  function handlePageChange({ newPage, search }: { newPage: number; search?: string }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (search) params.set('search', search)
    else params.delete('search')
    navigate(`?${params.toString()}`, { replace: false })
  }

  function openDeletePopup(row: PelanggaranPerMapel & { siswa: Akun }) {
    popup.open({
      title: 'Delete violation?',
      onClose: popup.close,
      content: (
        <Fragment>
          <p>
            Are you sure to delete violation{' '}
            <span className='font-semibold text-red-500'>
              {row.remark} ({row.poin})
            </span>{' '}
            record of <span className='font-semibold text-primary'>{DBHelpers.akun.getDisplayName(row.siswa)}</span>?
          </p>
          <deleteFetcher.Form
            id={deleteFormId}
            method='delete'
            action={AppNav.guruAction.daftarKelasDetailMataPelajaranDetailPelanggaranDelete({
              kelasId: loader.kelas.id,
              mataPelajaranId: loader.mataPelajaran.id,
              pelanggaranId: row.id,
            })}
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (searchText) params.set('search', searchText)
      else params.delete('search')
      params.set('page', '1')
      navigate(`?${params.toString()}`, { replace: false })
    }, 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='p-0! mt-4 lg:mt-8'>
      <GuruManageMataPelajaranDetailTab
        kelas={loader.kelas}
        mataPelajaran={loader.mataPelajaran}
        activeTabKey={TabKey.PELANGGARAN}
      />

      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        leadingView={
          <div className='flex flex-col sm:flex-row items-center gap-4 mb-5'>
            <TextInput
              className='max-w-xs'
              inputProps={{
                placeholder: 'Search violation...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
            <div className='grow'></div>
            <Button
              color='secondary'
              label={'Add'}
              startIcon={<MdAdd />}
              buttonProps={{
                disabled: loader.mataPelajaran.guruId !== user?.id,
                onClick: () =>
                  navigate(
                    AppNav.guru.daftarKelasDetailMataPelajaranDetailPelanggaranCreate({
                      kelasId: loader.kelas?.id ?? '',
                      mataPelajaranId: loader.mataPelajaran.id,
                    }),
                  ),
              }}
            />
          </div>
        }
        columns={[
          { field: 'siswa', label: 'Student', render: row => DBHelpers.akun.getDisplayName(row.siswa) },
          { field: 'poin', label: 'Point' },
          { field: 'remark', label: 'Remark' },
          {
            field: 'createdAt',
            label: 'Created At',
            render: row => format(new Date(row.createdAt), constants.dateFormats.rawDateTimeInput),
          },
          {
            field: 'updatedAt',
            label: 'Updated At',
            render: row => format(new Date(row.updatedAt), constants.dateFormats.rawDateTimeInput),
          },
          {
            field: 'deletedAt',
            label: 'Deleted At',
            render: row =>
              row.deletedAt ? format(new Date(row.deletedAt), constants.dateFormats.rawDateTimeInput) : '-',
          },
          {
            field: 'actions',
            label: 'Action',
            render: row => {
              const isDeletable = (user?.role === Role.ADMIN || user?.id === row.createdById) && row.deletedAt === null

              return (
                <DataGridActionButtonWrapper>
                  <Link
                    to={AppNav.guru.daftarKelasDetailMataPelajaranDetailPelanggaranDetail({
                      kelasId: loader.kelas?.id ?? '',
                      mataPelajaranId: loader.mataPelajaran.id,
                      pelanggaranId: row.id,
                    })}
                  >
                    <DataGridActionButton
                      icon={DataGridActionButtonHelper.getDetailIcon()}
                      color='info'
                      label={'Detail'}
                    />
                  </Link>
                  <DataGridActionButton
                    icon={DataGridActionButtonHelper.getEditIcon()}
                    color='warning'
                    label={'Edit'}
                    buttonProps={{
                      disabled: loader.mataPelajaran.guruId !== user?.id,
                      onClick: () =>
                        navigate(
                          AppNav.guru.daftarKelasDetailMataPelajaranDetailPelanggaranEdit({
                            kelasId: loader.kelas?.id ?? '',
                            mataPelajaranId: loader.mataPelajaran.id,
                            pelanggaranId: row.id,
                          }),
                        ),
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
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='border-none'
      />
    </Card>
  )
}
