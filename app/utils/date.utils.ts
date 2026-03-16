function getADateTreshold(currDate?: Date) {
  const start = currDate ?? new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(end.getDate() + 1)

  return { start, end }
}

const DateUtils = { getADateTreshold }

export default DateUtils
