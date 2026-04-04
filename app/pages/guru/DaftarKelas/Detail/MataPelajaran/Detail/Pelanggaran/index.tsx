import { Link, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
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

const sectionPrefix = 'guru-daftar-kelas-detail-mata-pelajaran-detail-pelanggaran'

export default function GuruDaftarKelasDetailMataPelajaranDetailPelanggaranPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaran>()
  const revalidator = useRevalidator()
  const user = useAuthStore(state => state.user)

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

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

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='!p-0 mt-4 lg:mt-8'>
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
                placeholder: 'Cari pelanggaran...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
            <div className='grow'></div>
            <Button
              color='secondary'
              label={'Tambah'}
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
          { field: 'title', label: 'Judul', render: row => DBHelpers.akun.getDisplayName(row.siswa) },
          {
            field: 'createdAt',
            label: 'Created At',
            render: row => format(new Date(row.createdAt), constants.dateFormats.rawDateTimeInput),
          },
          {
            field: 'tanggalBerakhir',
            label: 'Updated At',
            render: row => format(new Date(row.updatedAt), constants.dateFormats.rawDateTimeInput),
          },
          {
            field: 'actions',
            label: 'Aksi',
            render: row => (
              <DataGridActionButtonWrapper>
                <Link
                  to={AppNav.guru.daftarKelasDetailMataPelajaranDetailAssignmentDetail({
                    kelasId: loader.kelas?.id ?? '',
                    mataPelajaranId: loader.mataPelajaran.id,
                    assignmentId: row.id,
                  })}
                >
                  <DataGridActionButton
                    icon={DataGridActionButtonHelper.getDetailIcon()}
                    color='info'
                    label={'Detail'}
                  />
                </Link>
                <Link
                  to={AppNav.guru.daftarKelasDetailMataPelajaranDetailAssignmentEdit({
                    kelasId: loader.kelas?.id ?? '',
                    mataPelajaranId: loader.mataPelajaran.id,
                    assignmentId: row.id,
                  })}
                >
                  <DataGridActionButton
                    icon={DataGridActionButtonHelper.getEditIcon()}
                    color='warning'
                    label={'Edit'}
                  />
                </Link>
              </DataGridActionButtonWrapper>
            ),
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
