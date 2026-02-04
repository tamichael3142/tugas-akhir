import { Link, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import classNames from 'classnames'
import { ReactNode, useCallback, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import { Fragment } from 'react/jsx-runtime'
import { Button, StaticSelect } from '~/components/forms'
import { Card, LoadingFullScreen } from '~/components/ui'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import AppNav from '~/navigation'
import { LoaderDataGuruJadwalMengajar } from '~/types/loaders-data/guru'
import EnumsTitleUtils from '~/utils/enums-title.utils'

const sectionPrefix = 'guru-jadwal-mengajar'

export default function GuruJadwalMengajarPage() {
  const {
    tahunAjarans,
    days = [],
    hours = [],
    jadwalPelajarans = [],
    currentTahunAjaran,
  } = useLoaderData<LoaderDataGuruJadwalMengajar>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // const fetcher = useFetcher<ActionDataGuruJadwalMengajarDelete>({ key: deleteFormId })
  const revalidator = useRevalidator()
  // const popup = usePopup()
  // const user = useAuthStore(state => state.user)

  // const isDeleting = fetcher.state === 'submitting'
  // const isSuccess = fetcher.data?.success

  const selectedTahunAjaran = useCallback(() => {
    const selectedTahunAjaranId = searchParams.get('tahunAjaranId') ?? ''
    return tahunAjarans.find(item => item.id === selectedTahunAjaranId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('tahunAjaranId')])()

  const getSemesterAjaranOptions = useCallback(() => {
    if (selectedTahunAjaran && selectedTahunAjaran.semesterAjaran) return selectedTahunAjaran.semesterAjaran
    else return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('tahunAjaranId')])

  // useEffect(() => {
  //   if (isSuccess) {
  //     fetcher.load(AppNav.guru.masterPengumuman())
  //     revalidator.revalidate() // refresh data loader parent
  //     popup.close()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSuccess, revalidator])

  function handlePageChange({
    tahunAjaranId,
    semesterAjaranId,
  }: {
    tahunAjaranId?: string
    semesterAjaranId?: string
  }) {
    const params = new URLSearchParams(searchParams)
    if (tahunAjaranId) params.set('tahunAjaranId', String(tahunAjaranId))
    else params.delete('tahunAjaranId')
    if (semesterAjaranId) params.set('semesterAjaranId', String(semesterAjaranId))
    else params.delete('semesterAjaranId')
    navigate(`?${params.toString()}`, { replace: false })
  }

  // function openDeletePopup(row: Pengumuman) {
  //   popup.open({
  //     title: 'Hapus pengumuman?',
  //     onClose: popup.close,
  //     content: (
  //       <Fragment>
  //         <p>
  //           Apakah anda yakin untuk menghapus pengumuman <span className='font-semibold text-red-500'>{row.nama}</span>?
  //         </p>
  //         <fetcher.Form
  //           id={deleteFormId}
  //           method='delete'
  //           action={AppNav.guruAction.masterPengumumanDelete({ pengumumanId: row.id })}
  //         ></fetcher.Form>
  //       </Fragment>
  //     ),
  //     actionButtons: [
  //       {
  //         label: 'Cancel',
  //         color: 'secondary',
  //         variant: 'text',
  //         buttonProps: { onClick: popup.close },
  //       },
  //       {
  //         label: isDeleting ? 'Loading...' : 'Delete',
  //         color: 'primary',
  //         variant: 'contained',
  //         buttonProps: { type: 'submit', form: deleteFormId, disabled: isDeleting },
  //       },
  //     ],
  //   })
  // }

  function getJadwalPelajaran(dayId: string, hourId: string) {
    const existing = jadwalPelajarans?.find(item => item.dayId === dayId && item.hourId === hourId)
    return existing
  }

  function FilterGridItem({ children }: { children?: ReactNode }) {
    return <div className='col-span-2 md:col-span-1'>{children}</div>
  }

  useEffect(() => {
    const selectedTahunAjaranId = searchParams.get('tahunAjaranId') ?? ''
    const firstAvailableTahunAjaran = currentTahunAjaran ?? tahunAjarans[0]
    const currentSemester = new Date().getMonth() < 6 ? SemesterAjaranUrutan.DUA : SemesterAjaranUrutan.SATU
    const firstAvailableSemesterAjaran = firstAvailableTahunAjaran.semesterAjaran.find(
      item => item.urutan === currentSemester,
    )
    if (!selectedTahunAjaranId && firstAvailableTahunAjaran && firstAvailableSemesterAjaran) {
      handlePageChange({
        tahunAjaranId: firstAvailableTahunAjaran.id,
        semesterAjaranId: firstAvailableSemesterAjaran.id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <GuruPageContainer
      title='Master Pengumuman'
      actions={[
        <Link key={`${sectionPrefix}-add-button`} to={AppNav.guru.masterPengumumanCreate()}>
          <Button label='Tambah' startIcon={<FaPlus />} onlyIconOnSmallView />
        </Link>,
      ]}
    >
      <Card>
        <div className='mb-8'>
          <div className='grid grid-cols-2 gap-4'>
            <FilterGridItem>
              <StaticSelect
                label='Tahun Ajaran'
                options={[
                  { value: '', label: 'Pilih tahun ajaran' },
                  ...tahunAjarans.map(item => ({ value: item.id, label: item.nama })),
                ]}
                selectProps={{
                  value: searchParams.get('tahunAjaranId') ?? '',
                  onChange: newValue => {
                    handlePageChange({
                      tahunAjaranId: newValue.target.value,
                      semesterAjaranId: '',
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
                      tahunAjaranId: searchParams.get('tahunAjaranId') ?? '',
                      semesterAjaranId: newValue.target.value,
                    })
                  },
                }}
              />
            </FilterGridItem>
          </div>
        </div>

        {days.length && hours.length && tahunAjarans.length ? (
          <div className='overflow-x-auto relative mb-4'>
            <div className='w-full min-w-xl grid grid-cols-7 mb-1'>
              <div className='col-span-1 rounded-tl-lg border h-12 sticky left-0 bg-grey-light/90'></div>
              {days.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className={classNames('col-span-1 border h-12 flex items-center justify-center', {
                    ['rounded-tr-lg']: dayIdx === days.length - 1,
                  })}
                >
                  <p className='font-semibold'>{day.label}</p>
                </div>
              ))}
              {hours.map((hour, hourIdx) => (
                <Fragment key={hourIdx}>
                  <div
                    className={classNames(
                      'col-span-1 border flex items-center justify-center h-12 sticky left-0 bg-grey-light/90',
                      {
                        ['rounded-bl-lg']: hourIdx === hours.length - 1,
                      },
                    )}
                  >
                    <p className='font-semibold'>{hour.label}</p>
                  </div>
                  {days.map((day, dayIdx) => {
                    const currJadwalPelajaran = getJadwalPelajaran(day.id, hour.id)
                    return (
                      <div
                        key={`${hourIdx}-${dayIdx}`}
                        className={classNames('col-span-1 border h-12 overflow-auto', {
                          ['rounded-br-lg']: dayIdx === days.length - 1 && hourIdx === hours.length - 1,
                        })}
                      >
                        <div className='w-full min-h-11 whitespace-pre-wrap flex flex-row items-center justify-center'>
                          <p>
                            {currJadwalPelajaran
                              ? `[${currJadwalPelajaran?.kelas?.nama}] - ${currJadwalPelajaran?.mataPelajaran?.nama}`
                              : '-'}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div className='p-4 rounded-lg bg-grey-dark'>
            <p className='font-bold text-lg'>Info!</p>
            <p className='font-semibold'>Pilih tahun ajaran dan semester ajaran untuk melihat jadwal!</p>
          </div>
        )}
      </Card>
    </GuruPageContainer>
  )
}
