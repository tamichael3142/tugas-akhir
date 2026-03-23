import { Link, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Button, TextInput } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import { LoaderDataGuruDaftarKelasDetailMataPelajaran } from '~/types/loaders-data/guru'
import GuruDaftarKelasDetailTab, { TabKey } from '../_components/Tab'
import DBHelpers from '~/database/helpers'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import AppNav from '~/navigation'
import { Kelas } from '@prisma/client'
import EnumsTitleUtils from '~/utils/enums-title.utils'

const sectionPrefix = 'guru-daftar-kelas-detail-mata-pelajaran'

export default function GuruDaftarKelasDetailMataPelajaranPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailMataPelajaran>()
  const revalidator = useRevalidator()

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')
  const [hasSetedup, setHasSetedup] = useState<boolean>(false)

  const [activeSemester, setActiveSemester] = useState<SemesterAjaranUrutan | null>(null)
  const semester1 = loader.kelas?.tahunAjaran.semesterAjaran.find(item => item.urutan === SemesterAjaranUrutan.SATU)
  const semester2 = loader.kelas?.tahunAjaran.semesterAjaran.find(item => item.urutan === SemesterAjaranUrutan.DUA)

  function handlePageChange({
    newPage,
    search,
    semesterAjaranId,
  }: {
    newPage: number
    search?: string
    semesterAjaranId?: string
  }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (search) params.set('search', search)
    else params.delete('search')
    if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
    else params.delete('semesterAjaranId')
    navigate(`?${params.toString()}`, { replace: false })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (searchText) params.set('search', searchText)
      else params.delete('search')
      if (activeSemester && semester1 && semester2)
        params.set('semesterAjaranId', activeSemester === SemesterAjaranUrutan.SATU ? semester1.id : semester2.id)
      else params.delete('semesterAjaranId')
      params.set('page', '1')
      navigate(`?${params.toString()}`, { replace: false })
    }, 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, activeSemester])

  const resetMataPelajaranView = () => {
    const semesterAjaranId = new Date().getMonth() <= 5 ? semester2?.id : semester1?.id
    handlePageChange({ newPage: 1, semesterAjaranId })
    setActiveSemester(new Date().getMonth() <= 5 ? SemesterAjaranUrutan.DUA : SemesterAjaranUrutan.SATU)
    setSearchText(searchParams.get('search') ?? '')
  }

  useEffect(() => {
    if (semester1 && semester2 && !hasSetedup) {
      window.setTimeout(resetMataPelajaranView, 400)
      setHasSetedup(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semester1, semester2])

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='!p-0 mt-4 lg:mt-8'>
      <GuruDaftarKelasDetailTab kelas={loader.kelas as Kelas} activeTabKey={TabKey.MATA_PELAJARAN} />

      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        leadingView={
          <div className='flex flex-col sm:flex-row items-center gap-4 mb-5'>
            <Button
              label={`Semester ${EnumsTitleUtils.getSemesterAjaranUrutan(semester1?.urutan as SemesterAjaranUrutan)}`}
              color='secondary'
              variant={activeSemester === SemesterAjaranUrutan.SATU ? 'contained' : 'outlined'}
              buttonProps={{
                onClick: () => {
                  setActiveSemester(oldVal => (oldVal === SemesterAjaranUrutan.SATU ? null : SemesterAjaranUrutan.SATU))
                },
              }}
            />
            <Button
              label={`Semester ${EnumsTitleUtils.getSemesterAjaranUrutan(semester2?.urutan as SemesterAjaranUrutan)}`}
              color='secondary'
              variant={activeSemester === SemesterAjaranUrutan.DUA ? 'contained' : 'outlined'}
              buttonProps={{
                onClick: () => {
                  setActiveSemester(oldVal => (oldVal === SemesterAjaranUrutan.DUA ? null : SemesterAjaranUrutan.DUA))
                },
              }}
            />
            <div className='grow'></div>
            <TextInput
              className='max-w-xs'
              inputProps={{
                placeholder: 'Cari mata pelajaran...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
          </div>
        }
        columns={[
          { field: 'nama', label: 'Nama' },
          {
            field: 'guru',
            label: 'Guru',
            render: row => (row.guru ? DBHelpers.akun.getDisplayName(row.guru) : '-'),
          },
          {
            field: 'actions',
            label: 'Aksi',
            render: row => (
              <DataGridActionButtonWrapper>
                <Link to={AppNav.guru.manageMataPelajaranDetailAssignment({ mataPelajaranId: row.id })}>
                  <DataGridActionButton
                    icon={DataGridActionButtonHelper.getDetailIcon()}
                    color='info'
                    label={'Detail'}
                  />
                </Link>
              </DataGridActionButtonWrapper>
            ),
          },
        ]}
        rows={loader.mataPelajarans.data}
        pagination={{
          page: loader.mataPelajarans.pagination.page,
          pageSize: loader.mataPelajarans.pagination.limit,
          total: loader.mataPelajarans.pagination.total,
          totalPages: loader.mataPelajarans.pagination.totalPages,
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='border-none'
      />
    </Card>
  )
}
