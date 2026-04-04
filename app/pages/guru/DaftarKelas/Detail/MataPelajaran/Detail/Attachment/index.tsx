import { Link, useFetcher, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { Fragment, useEffect, useState } from 'react'
import { Button, TextInput } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAttachment } from '~/types/loaders-data/guru'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import AppNav from '~/navigation'
import { format } from 'date-fns'
import { MdAdd } from 'react-icons/md'
import constants from '~/constants'
import GuruManageMataPelajaranDetailTab, { TabKey } from '../_components/Tab'
import { MataPelajaranAttachment } from '@prisma/client'
import { usePopup } from '~/hooks/usePopup'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentDelete } from '~/types/actions-data/guru'
import useAuthStore from '~/store/authStore'

const sectionPrefix = 'guru-daftar-kelas-detail-mata-pelajaran-detail-attachment'
const deleteFormId = `${sectionPrefix}-delete-form`

export default function GuruDaftarKelasDetailMataPelajaranDetailAttachmentPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAttachment>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher<ActionDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentDelete>({ key: deleteFormId })
  const popup = usePopup()
  const user = useAuthStore(state => state.user)

  const isDeleting = fetcher.state === 'submitting'
  const isSuccess = fetcher.data?.success

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

  useEffect(() => {
    if (isSuccess) {
      fetcher.load(
        AppNav.guru.daftarKelasDetailMataPelajaranDetailAttachment({
          kelasId: loader.kelas.id,
          mataPelajaranId: loader.mataPelajaran.id,
        }),
      )
      revalidator.revalidate() // refresh data loader parent
      popup.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, revalidator])

  function handlePageChange({ newPage, search }: { newPage: number; search?: string }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (search) params.set('search', search)
    else params.delete('search')
    navigate(`?${params.toString()}`, { replace: false })
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

  function openDeletePopup(row: MataPelajaranAttachment) {
    popup.open({
      title: 'Hapus akun?',
      onClose: popup.close,
      content: (
        <Fragment>
          <p>
            Apakah anda yakin untuk menghapus attachment <span className='font-semibold text-red-500'>{row.title}</span>
            ?
          </p>
          <fetcher.Form
            id={deleteFormId}
            method='delete'
            action={AppNav.guruAction.daftarKelasDetailMataPelajaranDetailAttachmentDelete({
              kelasId: loader.kelas.id,
              mataPelajaranId: loader.mataPelajaran.id,
              attachmentId: row.id,
            })}
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
    <Card className='!p-0 mt-4 lg:mt-8'>
      <GuruManageMataPelajaranDetailTab
        kelas={loader.kelas}
        mataPelajaran={loader.mataPelajaran}
        activeTabKey={TabKey.ATTACHMENT}
      />

      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        leadingView={
          <div className='flex flex-col sm:flex-row items-center gap-4 mb-5'>
            <TextInput
              className='max-w-xs'
              inputProps={{
                placeholder: 'Cari lampiran...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
            <div className='grow'></div>
            <Button
              color='secondary'
              label={'Buat Lampiran'}
              startIcon={<MdAdd />}
              buttonProps={{
                disabled: loader.mataPelajaran.guruId !== user?.id,
                onClick: () =>
                  navigate(
                    AppNav.guru.daftarKelasDetailMataPelajaranDetailAttachmentCreate({
                      kelasId: loader.kelas.id,
                      mataPelajaranId: loader.mataPelajaran.id,
                    }),
                  ),
              }}
            />
          </div>
        }
        columns={[
          { field: 'title', label: 'Judul', render: row => row.title },
          { field: 'description', label: 'Deskripsi', render: row => row.description },
          {
            field: 'downloadUrl',
            label: 'File',
            render: row => (
              <a target='_blank' rel='noreferrer' href={row.downloadUrl}>
                Download
              </a>
            ),
          },
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
            field: 'actions',
            label: 'Aksi',
            render: row => (
              <DataGridActionButtonWrapper>
                <Link
                  to={AppNav.guru.daftarKelasDetailMataPelajaranDetailAttachmentDetail({
                    kelasId: loader.kelas?.id ?? '',
                    mataPelajaranId: loader.mataPelajaran.id,
                    attachmentId: row.id,
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
                        AppNav.guru.daftarKelasDetailMataPelajaranDetailAttachmentEdit({
                          kelasId: loader.kelas?.id ?? '',
                          mataPelajaranId: loader.mataPelajaran.id,
                          attachmentId: row.id,
                        }),
                      ),
                  }}
                />
                <DataGridActionButton
                  icon={DataGridActionButtonHelper.getDeleteIcon()}
                  color='error'
                  label={'Delete'}
                  buttonProps={{
                    disabled: loader.mataPelajaran.guruId !== user?.id,
                    onClick: () => openDeletePopup(row),
                  }}
                />
              </DataGridActionButtonWrapper>
            ),
          },
        ]}
        rows={loader.attachments.data}
        pagination={{
          page: loader.attachments.pagination.page,
          pageSize: loader.attachments.pagination.limit,
          total: loader.attachments.pagination.total,
          totalPages: loader.attachments.pagination.totalPages,
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='border-none'
      />
    </Card>
  )
}
