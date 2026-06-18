import { AcademicCalendarEvent } from '@prisma/client'
import { ActionFunctionArgs } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import { ActionDataAdminMasterTahunAjaranAcademicCalendarEventDelete } from '~/types/actions-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import GCalUtils from '~/thirdparty/utils/google-calendar.utils.server'

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataAdminMasterTahunAjaranAcademicCalendarEventDelete> {
  await requireAuthCookie(request)
  const eventId = params.eventId as AcademicCalendarEvent['id'] | null

  try {
    const currEvent = await prisma.academicCalendarEvent.findUnique({
      where: { id: eventId ?? '' },
    })

    if (!currEvent) throw { message: 'Academic calendar event not found!' }

    // Sync deletion to Google Calendar (non-blocking — DB deletion still proceeds)
    if (currEvent.googleEventId) {
      try {
        await GCalUtils.deleteCalendarEvent(currEvent.googleEventId)
      } catch (gcalError) {
        console.error('[GCal] Failed to delete Google Calendar event:', gcalError)
      }
    }

    return await prisma.academicCalendarEvent
      .delete({ where: { id: eventId ?? '' } })
      .then(result => ({
        success: true,
        message: 'Academic calendar event deleted!',
        data: { deletedEvent: result },
      }))
      .catch(error => {
        throw prismaErrorHandler(error)
      })
  } catch (error) {
    return {
      success: false,
      error,
      message: (error as { message?: string }).message ?? 'Unknown Error!',
      data: {},
    }
  }
}

export default function AdminMasterTahunAjaranAcademicCalendarEventDeleteRoute() {
  return <LoadingFullScreen />
}
