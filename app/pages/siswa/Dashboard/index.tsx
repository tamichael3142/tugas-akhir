import { Link, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react'
import classNames from 'classnames'
import { format } from 'date-fns'
import { Fragment } from 'react'
import { Button } from '~/components/forms'
import { AcademicCalendarCard, Card, LoadingFullScreen } from '~/components/ui'
import constants from '~/constants'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import AppNav from '~/navigation'
import { LoaderDataSiswaIndex } from '~/types/loaders-data/siswa'

const sectionPrefix = 'siswa-dashboard'

export default function SiswaDashboardPage() {
  const {
    currentTahunAjaran,
    days = [],
    hours = [],
    jadwalPelajarans = [],
    assignments = [],
  } = useLoaderData<LoaderDataSiswaIndex>()
  const revalidator = useRevalidator()
  const navigate = useNavigate()

  function getJadwalPelajaran(dayId: string, hourId: string) {
    const existing = jadwalPelajarans?.find(item => item.dayId === dayId && item.hourId === hourId)
    return existing
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <GuruPageContainer title='Dashboard' className='pb-72'>
      <AcademicCalendarCard currentTahunAjaran={currentTahunAjaran} className='mb-4 md:mb-8' />

      <Card className=''>
        <h2 className='font-semibold text-xl mb-4'>Weekly Schedule</h2>

        {days.length && hours.length ? (
          <div className='overflow-x-auto relative'>
            <div className='w-full min-w-xl grid grid-cols-6'>
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
                            className='col-span-5 border h-12 overflow-auto flex flex-row items-center justify-start md:justify-center px-4'
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
                                      className='hover:text-secondary'
                                      to={AppNav.siswa.kelasDetailMataPelajaran({
                                        kelasId: currJadwalPelajaran.kelas.id,
                                      })}
                                      target='_blank'
                                      rel='noreferrer'
                                    >
                                      {currJadwalPelajaran.kelas.nama}
                                    </Link>
                                  ) : null}
                                  {'] - '}
                                  {currJadwalPelajaran.kelas && currJadwalPelajaran.mataPelajaran ? (
                                    <Link
                                      className='hover:text-secondary'
                                      to={AppNav.siswa.kelasDetailMataPelajaranDetailAssignment({
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
        ) : (
          <div className='p-4 rounded-lg bg-grey-dark'>
            <p className='font-bold text-lg'>Info!</p>
            <p className='font-semibold'>Choose academic year and semester to check on the schedules!</p>
          </div>
        )}
      </Card>

      <Card className='mt-4 md:mt-8'>
        <h2 className='font-semibold text-xl mb-4'>On going Assignments</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
          {assignments.map(assignment => (
            <div
              key={`${sectionPrefix}-ongoing-assignments-table-row-${assignment.id}`}
              className='border shadow rounded-xl p-4 hover:shadow-lg duration-200 flex flex-col'
            >
              <div>
                <p className='font-semibold'>{assignment.title}</p>
                <p className='text-xs text-neutral-500'>
                  {format(assignment.tanggalMulai, constants.dateFormats.dateColumn)} -{' '}
                  {format(assignment.tanggalBerakhir, constants.dateFormats.dateColumn)}
                </p>

                <div className='flex flex-row flex-wrap gap-2 items-center mt-1'>
                  <button
                    type='button'
                    className='px-1 py-0.5 rounded-lg border border-primary text-primary bg-primary/10 text-sm cursor-pointer hover:shadow'
                    onClick={() => navigate(AppNav.siswa.kelasDetailMataPelajaran({ kelasId: assignment.kelasId }))}
                  >
                    {assignment.kelas.nama}
                  </button>
                  <button
                    type='button'
                    className='px-1 py-0.5 rounded-lg border border-secondary text-secondary bg-secondary/10 text-sm cursor-pointer hover:shadow'
                    onClick={() =>
                      navigate(
                        AppNav.siswa.kelasDetailMataPelajaranDetailAssignment({
                          kelasId: assignment.kelasId,
                          mataPelajaranId: assignment.mataPelajaranId,
                        }),
                      )
                    }
                  >
                    {assignment.mataPelajaran.nama}
                  </button>
                </div>
              </div>

              <div className='my-2 grow'>
                <p className='break-all text-sm'>{assignment.description}</p>
              </div>

              <div className='flex flex-row items-center justify-end gap-2'>
                <Button
                  size='sm'
                  variant='outlined'
                  color='secondary'
                  label='Submit assignment'
                  className='text-sm'
                  buttonProps={{
                    onClick: () =>
                      navigate(
                        AppNav.siswa.kelasDetailMataPelajaranDetailAssignmentDetail({
                          kelasId: assignment.kelasId,
                          mataPelajaranId: assignment.mataPelajaranId,
                          assignmentId: assignment.id,
                        }),
                      ),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </GuruPageContainer>
  )
}
