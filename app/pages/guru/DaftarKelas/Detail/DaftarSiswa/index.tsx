import { Link, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Button, TextInput } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import { LoaderDataGuruDaftarKelasDetailDaftarSiswa } from '~/types/loaders-data/guru'
import GuruDaftarKelasDetailTab, { TabKey } from '../_components/Tab'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import AppNav from '~/navigation'
import EnumsTitleUtils from '~/utils/enums-title.utils'

const sectionPrefix = 'guru-daftar-kelas-detail-daftar-siswa'

export default function GuruDaftarKelasDetailDaftarSiswaPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailDaftarSiswa>()
  const revalidator = useRevalidator()

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')
  const [hasSetedup, setHasSetedup] = useState<boolean>(false)

  const [activeSemester, setActiveSemester] = useState<SemesterAjaranUrutan | null>(null)
  const semester1 = loader.kelas?.tahunAjaran.semesterAjaran.find(item => item.urutan === SemesterAjaranUrutan.SATU)
  const semester2 = loader.kelas?.tahunAjaran.semesterAjaran.find(item => item.urutan === SemesterAjaranUrutan.DUA)

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
      if (activeSemester && semester1 && semester2)
        params.set('semesterAjaranId', activeSemester === SemesterAjaranUrutan.SATU ? semester1.id : semester2.id)
      else params.delete('semesterAjaranId')
      params.set('page', '1')
      navigate(`?${params.toString()}`, { replace: false })
    }, 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, activeSemester])

  const resetDaftarSiswaView = () => {
    const semesterAjaranId = new Date().getMonth() <= 5 ? semester2?.id : semester1?.id
    handlePageChange({ newPage: 1, semesterAjaranId })
    setActiveSemester(new Date().getMonth() <= 5 ? SemesterAjaranUrutan.DUA : SemesterAjaranUrutan.SATU)
    setSearchText(searchParams.get('search') ?? '')
  }

  useEffect(() => {
    if (semester1 && semester2 && !hasSetedup) {
      window.setTimeout(resetDaftarSiswaView, 400)
      setHasSetedup(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semester1, semester2])

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='!p-0 mt-4 lg:mt-8'>
      <GuruDaftarKelasDetailTab kelas={loader.kelas} activeTabKey={TabKey.DAFTAR_SISWA} />

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
                placeholder: 'Cari siswa...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
          </div>
        }
        columns={[
          { field: 'username', label: 'Username', render: row => row.siswa?.username },
          { field: 'firstName', label: 'Nama Depan', render: row => row.siswa?.firstName },
          { field: 'lastName', label: 'Nama Belakang', render: row => row.siswa?.lastName },
          { field: 'email', label: 'Email', render: row => row.siswa?.email },
          {
            field: 'actions',
            label: 'Aksi',
            render: row => (
              <DataGridActionButtonWrapper>
                <Link to={AppNav.admin.masterMataPelajaranEdit({ id: row.kelasId })}>
                  <DataGridActionButton
                    icon={DataGridActionButtonHelper.getEditIcon()}
                    color='warning'
                    label={'Edit'}
                    // buttonProps={{ disabled: !!row.deletedAt }}
                  />
                </Link>
              </DataGridActionButtonWrapper>
            ),
          },
        ]}
        rows={loader.siswaPerKelasPerSemesters.data}
        pagination={{
          page: loader.siswaPerKelasPerSemesters.pagination.page,
          pageSize: loader.siswaPerKelasPerSemesters.pagination.limit,
          total: loader.siswaPerKelasPerSemesters.pagination.total,
          totalPages: loader.siswaPerKelasPerSemesters.pagination.totalPages,
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='border-none'
      />
    </Card>
  )
}
