function getADateTreshold(currDate?: Date) {
  const start = currDate ?? new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(end.getDate() + 1)

  return { start, end }
}

export function normalizeDateRange({ startDate, endDate }: { startDate: Date | string; endDate: Date | string }): {
  start: Date
  end: Date
} {
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date input')
  }

  // Swap jika terbalik
  if (end < start) {
    return normalizeDateRange({ startDate: end, endDate: start })
  }

  const normalizedStart = new Date(start)
  normalizedStart.setHours(0, 0, 0, 0)

  const normalizedEnd = new Date(end)
  normalizedEnd.setHours(23, 59, 59, 999)

  return {
    start: normalizedStart,
    end: normalizedEnd,
  }
}

const DateUtils = { getADateTreshold, normalizeDateRange }

export default DateUtils
