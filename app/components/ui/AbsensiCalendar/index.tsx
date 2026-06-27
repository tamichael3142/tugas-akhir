import { Link, useNavigate, useSearchParams } from '@remix-run/react'
import { useEffect } from 'react'
import * as dateFns from 'date-fns'
import classNames from 'classnames'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Button } from '~/components/forms'

export type AbsensiCalendarItem = {
  id: string
  tanggal: Date | string
  kelas: { nama: string }
  status?: string
}

export type AbsensiCalendarProps = {
  absensis: AbsensiCalendarItem[]
  editUrl?: (id: string) => string
  mutateUrl?: (id: string) => string
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function AbsensiCalendar({ absensis, editUrl, mutateUrl }: AbsensiCalendarProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const today = new Date()
  const calYear = parseInt(searchParams.get('calYear') ?? String(today.getFullYear()))
  const calMonth = parseInt(searchParams.get('calMonth') ?? String(today.getMonth()))
  const viewDate = new Date(calYear, calMonth, 1)

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) params.set(key, value)
      else params.delete(key)
    })
    navigate(`?${params.toString()}`, { replace: false })
  }

  function navigateMonth(direction: 1 | -1) {
    const newDate = dateFns.addMonths(viewDate, direction)
    updateParams({
      calYear: String(newDate.getFullYear()),
      calMonth: String(newDate.getMonth()),
      startDate: dateFns.format(dateFns.startOfMonth(newDate), 'yyyy-MM-dd'),
      endDate: dateFns.format(dateFns.endOfMonth(newDate), 'yyyy-MM-dd'),
    })
  }

  // On first mount, initialize URL params to current month if absent
  useEffect(() => {
    if (!searchParams.get('calYear') && !searchParams.get('calMonth')) {
      const params = new URLSearchParams(searchParams)
      params.set('calYear', String(today.getFullYear()))
      params.set('calMonth', String(today.getMonth()))
      params.set('startDate', dateFns.format(dateFns.startOfMonth(today), 'yyyy-MM-dd'))
      params.set('endDate', dateFns.format(dateFns.endOfMonth(today), 'yyyy-MM-dd'))
      navigate(`?${params.toString()}`, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Build calendar grid (Sun → Sat weeks)
  const calStart = dateFns.startOfWeek(dateFns.startOfMonth(viewDate))
  const calEnd = dateFns.endOfWeek(dateFns.endOfMonth(viewDate))

  const calDays: Date[] = []
  let cur = calStart
  while (cur <= calEnd) {
    calDays.push(cur)
    cur = dateFns.addDays(cur, 1)
  }

  return (
    <>
      {/* Month navigation header */}
      <div className='flex items-center justify-between mb-6'>
        <Button
          aria-label='Previous month'
          color='secondary'
          label={<FaChevronLeft />}
          buttonProps={{ onClick: () => navigateMonth(-1) }}
        />
        <h2 className='text-lg font-semibold text-gray-800'>{dateFns.format(viewDate, 'MMMM yyyy')}</h2>
        <Button
          aria-label='Next month'
          color='secondary'
          label={<FaChevronRight />}
          buttonProps={{ onClick: () => navigateMonth(1) }}
        />
      </div>

      {/* Day header row */}
      <div className='grid grid-cols-7 border-b'>
        {DAY_NAMES.map((day, i) => (
          <div
            key={day}
            className={classNames('text-center text-xs font-semibold py-2', {
              'text-rose-500': i === 0,
              'text-cyan-500': i === 6,
              'text-gray-500': i !== 0 && i !== 6,
            })}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className='grid grid-cols-7 border-l border-t'>
        {calDays.map((day, idx) => {
          const isCurrentMonth = dateFns.isSameMonth(day, viewDate)
          const isToday = dateFns.isToday(day)
          const isSunday = dateFns.getDay(day) === 0
          const isSaturday = dateFns.getDay(day) === 6
          const dayAbsensis = absensis.filter(a => dateFns.isSameDay(new Date(a.tanggal as unknown as string), day))

          return (
            <div
              key={idx}
              className={classNames('h-36 overflow-y-auto relative border-r border-b p-1', {
                'bg-white': isCurrentMonth,
                'bg-gray-50': !isCurrentMonth,
              })}
            >
              <div
                className={classNames(
                  'text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full mx-auto sticky top-0 shadow',
                  {
                    'bg-white': !isToday,
                    'bg-primary text-white': isToday,
                    'text-rose-500': !isToday && isSunday,
                    'text-cyan-500': !isToday && isSaturday,
                    'text-gray-800': !isToday && !isSunday && !isSaturday && isCurrentMonth,
                    'text-gray-400': !isToday && !isSunday && !isSaturday && !isCurrentMonth,
                  },
                )}
              >
                {dateFns.format(day, 'd')}
              </div>
              <div className='space-y-1'>
                {dayAbsensis.map(absensi => (
                  <div key={absensi.id} className='border rounded-lg px-1.5 py-1 text-xs'>
                    <div className='font-semibold truncate'>{absensi.kelas.nama}</div>
                    {editUrl && mutateUrl ? (
                      <div className='flex gap-2 mt-1'>
                        <Link to={editUrl(absensi.id)} className='text-yellow-500 hover:underline font-medium'>
                          Edit
                        </Link>
                        <Link to={mutateUrl(absensi.id)} className='text-secondary hover:underline font-medium'>
                          Mutate
                        </Link>
                      </div>
                    ) : absensi.status != null ? (
                      <div className='mt-1 font-medium text-gray-600'>{absensi.status}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {!absensis.some(a => dateFns.isSameMonth(new Date(a.tanggal as unknown as string), viewDate)) && (
        <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
          <p className='text-sm font-medium'>No attendance records for {dateFns.format(viewDate, 'MMMM yyyy')}.</p>
        </div>
      )}
    </>
  )
}
