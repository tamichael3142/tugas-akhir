import { Link, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { TextInput } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import AppNav from '~/navigation'
import { format } from 'date-fns'
import constants from '~/constants'
import SiswaKelasDetailMataPelajaranDetailTab, { TabKey } from '../_components/Tab'
import { LoaderDataSiswaKelasDetailMataPelajaranDetailAssignment } from '~/types/loaders-data/siswa'
import classNames from 'classnames'
import DBHelpers from '~/database/helpers'

const sectionPrefix = 'siswa-kelas-detail-mata-pelajaran-detail-assignment'

export default function SiswaKelasDetailMataPelajaranDetailAssignmentPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataSiswaKelasDetailMataPelajaranDetailAssignment>()
  const revalidator = useRevalidator()

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

  const renderSubmittableIndicator = (isOpen: boolean) => {
    return (
      <div className='flex items-center justify-center'>
        <div
          className={classNames('rounded-full w-5 h-5 text-xs flex items-center justify-center text-center', {
            ['bg-secondary']: isOpen,
            ['border border-primary text-primary font-bold']: !isOpen,
          })}
        >
          {!isOpen ? 'X' : null}
        </div>
      </div>
    )
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='!p-0 mt-4 lg:mt-8'>
      <SiswaKelasDetailMataPelajaranDetailTab
        kelas={loader.kelas}
        mataPelajaran={loader.mataPelajaran}
        activeTabKey={TabKey.ASSIGNMENT}
      />

      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        leadingView={
          <div className='flex flex-col sm:flex-row items-center gap-4 mb-5'>
            <TextInput
              className='max-w-xs'
              inputProps={{
                placeholder: 'Cari tugas...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
            <div className='grow'></div>
          </div>
        }
        columns={[
          {
            field: 'isSubmitable',
            label: <div className='text-center'>{'Open'}</div>,
            render: row => renderSubmittableIndicator(DBHelpers.mapelAssignment.getIsSubmittable(row)),
          },
          { field: 'title', label: 'Judul', render: row => row.title },
          {
            field: 'tanggalMulai',
            label: 'Mulai',
            render: row => format(new Date(row.tanggalMulai), constants.dateFormats.rawDateTimeInput),
          },
          {
            field: 'tanggalBerakhir',
            label: 'Berakhir',
            render: row => format(new Date(row.tanggalBerakhir), constants.dateFormats.rawDateTimeInput),
          },
          {
            field: 'actions',
            label: 'Aksi',
            render: row => {
              return (
                <DataGridActionButtonWrapper>
                  <Link
                    to={AppNav.siswa.kelasDetailMataPelajaranDetailAssignmentDetail({
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
                </DataGridActionButtonWrapper>
              )
            },
          },
        ]}
        rows={loader.assignments.data}
        pagination={{
          page: loader.assignments.pagination.page,
          pageSize: loader.assignments.pagination.limit,
          total: loader.assignments.pagination.total,
          totalPages: loader.assignments.pagination.totalPages,
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='border-none'
      />
    </Card>
  )
}
