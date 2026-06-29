import { Link, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Button, TextInput } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import { AssignmentSubmissionType, AssignmentSubmissionAllowedFileType } from '~/database/enums/prisma.enums'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignment } from '~/types/loaders-data/guru'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import AppNav from '~/navigation'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { format } from 'date-fns'
import { MdAdd } from 'react-icons/md'
import constants from '~/constants'
import GuruManageMataPelajaranDetailTab, { TabKey } from '../_components/Tab'
import useAuthStore from '~/store/authStore'

const sectionPrefix = 'guru-daftar-kelas-detail-mata-pelajaran-detail-assignment'

export default function GuruDaftarKelasDetailMataPelajaranDetailAssignmentPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignment>()
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
        activeTabKey={TabKey.ASSIGNMENT}
      />

      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        leadingView={
          <div className='flex flex-col sm:flex-row items-center gap-4 mb-5'>
            <TextInput
              className='max-w-xs'
              inputProps={{
                placeholder: 'Search assignment...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
            <div className='grow'></div>
            <Button
              color='secondary'
              label={'Create Assignment'}
              startIcon={<MdAdd />}
              buttonProps={{
                disabled: loader.mataPelajaran.guruId !== user?.id,
                onClick: () =>
                  navigate(
                    AppNav.guru.daftarKelasDetailMataPelajaranDetailAssignmentCreate({
                      kelasId: loader.kelas?.id ?? '',
                      mataPelajaranId: loader.mataPelajaran.id,
                    }),
                  ),
              }}
            />
          </div>
        }
        columns={[
          { field: 'title', label: 'Title', render: row => row.title },
          {
            field: 'tanggalMulai',
            label: 'Start',
            render: row => format(new Date(row.tanggalMulai), constants.dateFormats.rawDateTimeInput),
          },
          {
            field: 'tanggalBerakhir',
            label: 'End',
            render: row => format(new Date(row.tanggalBerakhir), constants.dateFormats.rawDateTimeInput),
          },
          {
            field: 'isSubmitable',
            label: 'Time Restriction',
            render: row =>
              row.isSubmitable ? (
                <span className='text-primary'>{'No Restriction'}</span>
              ) : (
                <span className='text-secondary'>{'Restricted'}</span>
              ),
          },
          {
            field: 'submissionType',
            label: 'Type',
            render: row => {
              let result = EnumsTitleUtils.getAssignmentSubmissionType(row.submissionType as AssignmentSubmissionType)
              if (row.submissionType === AssignmentSubmissionType.FILE_UPLOAD && !!row.submissionAllowedFileType)
                result += ` (${EnumsTitleUtils.getAssignmentSubmissionAllowedFileType(row.submissionAllowedFileType as AssignmentSubmissionAllowedFileType)})`
              return result
            },
          },
          {
            field: 'actions',
            label: 'Action',
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
