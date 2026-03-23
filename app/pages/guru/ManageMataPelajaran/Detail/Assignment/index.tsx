import { Link, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Button, TextInput } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import { AssignmentSubmissionType } from '~/database/enums/prisma.enums'
import { LoaderDataGuruManageMataPelajaranDetailAssignment } from '~/types/loaders-data/guru'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import AppNav from '~/navigation'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import GuruManageMataPelajaranDetailTab, { TabKey } from '../_components/Tab'
import { format } from 'date-fns'
import { MdAdd } from 'react-icons/md'
import constants from '~/constants'

const sectionPrefix = 'guru-manage-mata-pelajaran-detail-assignment'

export default function GuruManageMataPelajaranDetailAssignmentPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataGuruManageMataPelajaranDetailAssignment>()
  const revalidator = useRevalidator()

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

  function handlePageChange({ newPage, semesterAjaranId }: { newPage: number; semesterAjaranId?: string }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
    else params.delete('semesterAjaranId')
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
      <GuruManageMataPelajaranDetailTab mataPelajaran={loader.mataPelajaran} activeTabKey={TabKey.ASSIGNMENT} />

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
            <Link
              to={AppNav.guru.manageMataPelajaranDetailAssignmentCreate({ mataPelajaranId: loader.mataPelajaran.id })}
            >
              <Button color='secondary' label={'Buat Tugas'} startIcon={<MdAdd />} />
            </Link>
          </div>
        }
        columns={[
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
          { field: 'isSubmitable', label: 'Submission', render: row => (row.isSubmitable ? 'Open' : 'Close') },
          {
            field: 'submissionType',
            label: 'Tipe',
            render: row => EnumsTitleUtils.getAssignmentSubmissionType(row.submissionType as AssignmentSubmissionType),
          },
          {
            field: 'actions',
            label: 'Aksi',
            render: row => (
              <DataGridActionButtonWrapper>
                <Link
                  to={AppNav.guru.manageMataPelajaranDetailAssignmentEdit({
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
