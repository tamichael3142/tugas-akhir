import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { useCallback, useEffect, useState } from 'react'
import { Button, TextInput } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import { LoaderDataGuruDaftarKelasDetailAbsensiList } from '~/types/loaders-data/guru'
import GuruDaftarKelasDetailTab, { TabKey } from '../_components/Tab'
import { Kelas } from '@prisma/client'
import constants from '~/constants'
import * as dateFns from 'date-fns'
import AppNav from '~/navigation'
import EnumsTitleUtils from '~/utils/enums-title.utils'

const sectionPrefix = 'guru-daftar-kelas-detail-absensi-list'

export default function GuruDaftarKelasDetailAbsensiListPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailAbsensiList>()
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

  const resetAbsensiListView = () => {
    const semesterAjaranId = new Date().getMonth() <= 5 ? semester2?.id : semester1?.id
    handlePageChange({ newPage: 1, semesterAjaranId })
    setActiveSemester(new Date().getMonth() <= 5 ? SemesterAjaranUrutan.DUA : SemesterAjaranUrutan.SATU)
    setSearchText(searchParams.get('search') ?? '')
  }
  const absenHariIniButtonClick = useCallback(() => {
    const semesterAjaranId = searchParams.get('semesterAjaranId')
    if (loader.todayAbsensi) navigate(AppNav.guru.manageAbsensiEdit({ absensiId: loader.todayAbsensi.id }))
    else if (semesterAjaranId)
      navigate(AppNav.guruAction.daftarKelasDetailAbsensiCreate({ kelasId: loader.kelas?.id ?? '', semesterAjaranId }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, loader.todayAbsensi])

  useEffect(() => {
    if (semester1 && semester2 && !hasSetedup) {
      window.setTimeout(resetAbsensiListView, 400)
      setHasSetedup(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semester1, semester2])

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='p-0! mt-4 lg:mt-8'>
      <GuruDaftarKelasDetailTab kelas={loader.kelas as Kelas} activeTabKey={TabKey.ABSENSI} />

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
                placeholder: 'Cari...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
            <Button
              label={'Absensi Hari Ini'}
              color='primary'
              buttonProps={{
                disabled: !searchParams.get('semesterAjaranId'),
                onClick: absenHariIniButtonClick,
              }}
            />
          </div>
        }
        columns={[
          { field: 'tanggalText', label: 'Tanggal', render: row => row.tanggalText },
          { field: 'label', label: 'Label', render: row => row.label },
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
        ]}
        rows={loader.absensis.data}
        pagination={{
          page: loader.absensis.pagination.page,
          pageSize: loader.absensis.pagination.limit,
          total: loader.absensis.pagination.total,
          totalPages: loader.absensis.pagination.totalPages,
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='border-none'
      />
    </Card>
  )
}
