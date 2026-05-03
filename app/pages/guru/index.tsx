import { Link, useLoaderData, useRevalidator } from '@remix-run/react'
import classNames from 'classnames'
import { Fragment } from 'react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import constants from '~/constants'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import AppNav from '~/navigation'
import { LoaderDataGuruDashboard } from '~/types/loaders-data/guru'

const sectionPrefix = 'guru-dashboard'

export default function GuruDashboardPage() {
  const { days = [], hours = [], jadwalPelajarans = [] } = useLoaderData<LoaderDataGuruDashboard>()
  const revalidator = useRevalidator()

  function getJadwalPelajaran(dayId: string, hourId: string) {
    const existing = jadwalPelajarans?.find(item => item.dayId === dayId && item.hourId === hourId)
    return existing
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <GuruPageContainer title='Jadwal Mengajar' actions={[<BackButton key={`${sectionPrefix}-back-button`} />]}>
      <Card>
        {days.length && hours.length ? (
          <div className='overflow-x-auto relative mb-4'>
            <div className='w-full min-w-xl grid grid-cols-2 mb-1'>
              {days.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className={classNames('col-span-2 border h-12 flex items-center justify-center', {
                    ['rounded-t-lg']: dayIdx === days.length - 1,
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
                    <p className='font-semibold'>{`${hour.label.split('-')[0]} - ${hour.label.split('-')[1]}`}</p>
                  </div>
                  {days.map((day, dayIdx) => {
                    const currJadwalPelajaran = getJadwalPelajaran(day.id, hour.id)
                    const containerKey = `${hourIdx}-${dayIdx}`
                    const onlyFirst = dayIdx === 0
                    const isMorningAssembly = hour.id === constants.jadwal.morningAssemblyHour
                    const isSnackBreak = hour.id === constants.jadwal.snackBreakHour
                    const isLunchBreak = hour.id === constants.jadwal.lunchBreakHour
                    const isClosingClass = hour.id === constants.jadwal.closingClassHour

                    function getSpecialHourLabel() {
                      if (isMorningAssembly) return constants.jadwal.morningAssemblyLabel
                      if (isSnackBreak) return constants.jadwal.snackBreakLabel
                      if (isLunchBreak) return constants.jadwal.lunchBreakLabel
                      if (isClosingClass) return constants.jadwal.closingClassLabel
                      return ''
                    }

                    if (isMorningAssembly || isSnackBreak || isLunchBreak || isClosingClass) {
                      if (onlyFirst)
                        return (
                          <div
                            key={containerKey}
                            className='col-span-1 border h-12 overflow-auto flex flex-row items-center justify-center px-4'
                          >
                            <p className='text-center font-semibold'>{getSpecialHourLabel()}</p>
                          </div>
                        )
                      else return null
                    } else
                      return (
                        <div
                          key={containerKey}
                          className={classNames('col-span-1 border h-12 overflow-auto', {
                            ['rounded-br-lg']: dayIdx === days.length - 1 && hourIdx === hours.length - 1,
                          })}
                        >
                          <div className='w-full min-h-11 whitespace-pre-wrap flex flex-row items-center justify-center'>
                            <p>
                              {currJadwalPelajaran ? (
                                <Fragment>
                                  {'['}
                                  {currJadwalPelajaran.kelas ? (
                                    <Link
                                      className='hover:text-primary'
                                      to={AppNav.guru.daftarKelasDetail({ kelasId: currJadwalPelajaran.kelas.id })}
                                      target='_blank'
                                      rel='noreferrer'
                                    >
                                      {currJadwalPelajaran.kelas.nama}
                                    </Link>
                                  ) : null}
                                  {'] - '}
                                  {currJadwalPelajaran.kelas && currJadwalPelajaran.mataPelajaran ? (
                                    <Link
                                      className='hover:text-primary'
                                      to={AppNav.guru.daftarKelasDetailMataPelajaranDetailBeritaAcara({
                                        kelasId: currJadwalPelajaran.kelas.id,
                                        mataPelajaranId: currJadwalPelajaran.mataPelajaran.id,
                                      })}
                                      target='_blank'
                                      rel='noreferrer'
                                    >
                                      {currJadwalPelajaran.mataPelajaran.nama}
                                    </Link>
                                  ) : null}
                                </Fragment>
                              ) : (
                                '-'
                              )}
                            </p>
                          </div>
                        </div>
                      )
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        ) : null}
      </Card>
    </GuruPageContainer>
  )
}
