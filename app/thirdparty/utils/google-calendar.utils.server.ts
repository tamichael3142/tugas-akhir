import { google } from 'googleapis'

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/calendar'],
})

const calendar = google.calendar({ version: 'v3', auth })

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!

export type CalendarEventInput = {
  title: string
  description?: string
  location?: string
  startDate: string // "YYYY-MM-DD"
  endDate: string // "YYYY-MM-DD" (inclusive)
}

// Google Calendar all-day events use an exclusive end date, so add 1 day.
function exclusiveEndDate(dateStr: string): string {
  const d = new Date(dateStr)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().split('T')[0]
}

async function addCalendarEvent(event: CalendarEventInput) {
  const response = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: {
      summary: event.title,
      description: event.description,
      location: event.location,
      start: { date: event.startDate },
      end: { date: exclusiveEndDate(event.endDate) },
    },
  })

  return response.data
}

async function updateCalendarEvent(eventId: string, event: Partial<CalendarEventInput>) {
  const response = await calendar.events.patch({
    calendarId: CALENDAR_ID,
    eventId,
    requestBody: {
      summary: event.title,
      description: event.description,
      location: event.location,
      ...(event.startDate && { start: { date: event.startDate } }),
      ...(event.endDate && { end: { date: exclusiveEndDate(event.endDate) } }),
    },
  })

  return response.data
}

async function deleteCalendarEvent(eventId: string) {
  await calendar.events.delete({
    calendarId: CALENDAR_ID,
    eventId,
  })
}

const GCalUtils = {
  addCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
}

export default GCalUtils
