import { Link, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { Button, StaticSelect } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import AppNav from '~/navigation'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import DataGridActionButtonWrapper from '~/components/ui/DataGrid/ActionButton/Wrapper'
import DataGridActionButtonHelper from '~/components/ui/DataGrid/ActionButton/helper'
import { ReactNode, useCallback } from 'react'
import DBHelpers from '~/database/helpers'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import { LoaderDataGuruDaftarKelas } from '~/types/loaders-data/guru'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import { FaScrewdriverWrench } from 'react-icons/fa6'
import { FaInfo } from 'react-icons/fa'

const sectionPrefix = 'guru-daftar-kelas'
// const deleteFormId = `${sectionPrefix}-delete-form`

export default function GuruDaftarKelasPage() {
  const loader = useLoaderData<LoaderDataGuruDaftarKelas>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const revalidator = useRevalidator()

  function handlePageChange({
    newPage,
    semesterAjaranId,
    tahunAjaranId,
    waliId,
  }: {
    newPage: number
    tahunAjaranId?: string
    semesterAjaranId?: string
    waliId?: string
  }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (tahunAjaranId) params.set('tahunAjaranId', tahunAjaranId)
    else params.delete('tahunAjaranId')
    if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
    else params.delete('semesterAjaranId')
    if (waliId) params.set('waliId', waliId)
    else params.delete('waliId')
    navigate(`?${params.toString()}`, { replace: false })
  }

  function FilterGridItem({ children }: { children?: ReactNode }) {
    return <div className='col-span-3 md:col-span-1'>{children}</div>
  }

  const loadCurrentPeriod = useCallback(() => {
    const selectedTahunAjaranId = searchParams.get('tahunAjaranId') ?? ''
    const firstAvailableTahunAjaran = loader.currentTahunAjaran ?? loader.tahunAjarans[0]
    const currentSemester = new Date().getMonth() < 6 ? SemesterAjaranUrutan.DUA : SemesterAjaranUrutan.SATU
    const firstAvailableSemesterAjaran = firstAvailableTahunAjaran.semesterAjaran.find(
      item => item.urutan === currentSemester,
    )
    if (!selectedTahunAjaranId && firstAvailableTahunAjaran && firstAvailableSemesterAjaran) {
      handlePageChange({
        newPage: loader.kelass?.pagination.page ?? 1,
        tahunAjaranId: firstAvailableTahunAjaran.id,
        semesterAjaranId: firstAvailableSemesterAjaran.id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // useEffect(() => {
  //   if (window.confirm('Apakah ingin load periode saat ini?')) loadCurrentPeriod()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [loader.currentTahunAjaran])

  const selectedTahunAjaran = useCallback(() => {
    const selectedTahunAjaranId = searchParams.get('tahunAjaranId') ?? ''
    return loader.tahunAjarans.find(item => item.id === selectedTahunAjaranId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('tahunAjaranId')])()

  const getSemesterAjaranOptions = useCallback(() => {
    if (selectedTahunAjaran && selectedTahunAjaran.semesterAjaran) return selectedTahunAjaran.semesterAjaran
    else return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('tahunAjaranId')])

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <GuruPageContainer title='Daftar Kelas'>
      <Card className='mb-8 shadow-lg'>
        <div className='flex flex-row items-center justify-end gap-4'>
          <Button
            label='Muat Periode Sekarang'
            color='secondary'
            startIcon={<FaScrewdriverWrench />}
            onlyIconOnSmallView
            buttonProps={{ type: 'button', onClick: loadCurrentPeriod }}
          />
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <FilterGridItem>
            <StaticSelect
              label='Tahun Ajaran'
              options={[
                { value: '', label: 'Semua' },
                ...loader.tahunAjarans.map(item => ({ value: item.id, label: item.nama })),
              ]}
              selectProps={{
                value: searchParams.get('tahunAjaranId') ?? '',
                onChange: newValue => {
                  handlePageChange({
                    newPage: loader.kelass?.pagination.page ?? 1,
                    tahunAjaranId: newValue.target.value,
                    waliId: searchParams.get('waliId') ?? '',
                  })
                },
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <StaticSelect
              label='Semester Ajaran'
              options={[
                { value: '', label: 'Pilih semester ajaran' },
                ...getSemesterAjaranOptions().map(item => ({
                  value: item.id,
                  label: EnumsTitleUtils.getSemesterAjaranUrutan(item.urutan as SemesterAjaranUrutan),
                })),
              ]}
              selectProps={{
                value: searchParams.get('semesterAjaranId') ?? '',
                onChange: newValue => {
                  handlePageChange({
                    newPage: loader.kelass?.pagination.page ?? 1,
                    tahunAjaranId: searchParams.get('tahunAjaranId') ?? '',
                    semesterAjaranId: newValue.target.value,
                  })
                },
              }}
            />
          </FilterGridItem>
        </div>
      </Card>
      {loader.kelass && Array.isArray(loader.kelass.data) ? (
        <DataGrid
          id={`${sectionPrefix}-data-grid`}
          columns={[
            { field: 'nama', label: 'Nama' },
            { field: 'tahunAjaran', label: 'Tahun Ajaran', render: row => row.tahunAjaran.nama },
            {
              field: 'wali',
              label: 'Wali Kelas',
              render: row => (row.wali ? DBHelpers.akun.getDisplayName(row.wali) : '-'),
            },
            // {
            //   field: 'createdAt',
            //   label: 'Created At',
            //   render: row => dateFns.format(row.createdAt, constants.dateFormats.dateColumn),
            // },
            // {
            //   field: 'updatedAt',
            //   label: 'Updated At',
            //   render: row => dateFns.format(row.updatedAt, constants.dateFormats.dateColumn),
            // },
            // {
            //   field: 'deletedAt',
            //   label: 'Deleted At',
            //   render: row => (row.deletedAt ? dateFns.format(row.deletedAt, constants.dateFormats.dateColumn) : '-'),
            // },
            {
              field: 'actions',
              label: 'Aksi',
              render: row => {
                const semesterSatu = row.tahunAjaran.semesterAjaran.find(
                  item => item.urutan === SemesterAjaranUrutan.SATU,
                )
                const semesterDua = row.tahunAjaran.semesterAjaran.find(
                  item => item.urutan === SemesterAjaranUrutan.DUA,
                )

                return (
                  <DataGridActionButtonWrapper>
                    <Link to={AppNav.guru.daftarKelasDetail({ kelasId: row.id })}>
                      <DataGridActionButton icon={<FaInfo />} color='info' label={'Detail Kelas'} />
                    </Link>
                    {semesterSatu ? (
                      <Link
                        to={AppNav.guru.jadwalMengajar({
                          tahunAjaranId: row.tahunAjaranId,
                          semesterAjaranId: semesterSatu.id,
                        })}
                      >
                        <DataGridActionButton
                          icon={DataGridActionButtonHelper.getManageIcon()}
                          color='success'
                          label={'Jadwal Semester 1'}
                          buttonProps={{ disabled: !!row.deletedAt }}
                        />
                      </Link>
                    ) : null}
                    {semesterDua ? (
                      <Link
                        to={AppNav.guru.jadwalMengajar({
                          tahunAjaranId: row.tahunAjaranId,
                          semesterAjaranId: semesterDua.id,
                        })}
                      >
                        <DataGridActionButton
                          icon={DataGridActionButtonHelper.getManageIcon()}
                          color='success'
                          label={'Jadwal Semester 2'}
                          buttonProps={{ disabled: !!row.deletedAt }}
                        />
                      </Link>
                    ) : null}
                  </DataGridActionButtonWrapper>
                )
              },
            },
          ]}
          rows={loader.kelass.data}
          pagination={{
            page: loader.kelass.pagination.page,
            pageSize: loader.kelass.pagination.limit,
            total: loader.kelass.pagination.total,
            totalPages: loader.kelass.pagination.totalPages,
            onPageChange: newPage => handlePageChange({ newPage }),
          }}
          className='shadow-primary'
        />
      ) : null}
    </GuruPageContainer>
  )
}
