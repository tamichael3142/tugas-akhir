import { DayID } from '../enums/prisma.enums'

function transformDateToDay(date?: Date): DayID | null {
  if (!date) return null

  const dateDay = date.getDay()
  switch (dateDay) {
    case 1:
      return DayID.MON
    case 2:
      return DayID.TUE
    case 3:
      return DayID.WED
    case 4:
      return DayID.THU
    case 5:
      return DayID.FRI
    default:
      return DayID.MON
  }
}

function transformDayToDateDay(dayId: DayID): number {
  switch (dayId) {
    case DayID.MON:
      return 1
    case DayID.TUE:
      return 2
    case DayID.WED:
      return 3
    case DayID.THU:
      return 4
    case DayID.FRI:
      return 5
    default:
      return 1
  }
}

const day = {
  transformDateToDay,
  transformDayToDateDay,
}

export default day
