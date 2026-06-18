import { AcademicCalendarEvent, TahunAjaran } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { format } from 'date-fns'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import AdminMasterTahunAjaranManageAcademicCalendarEditPage from '~/pages/admin/MasterTahunAjaran/ManageAcademicCalendar/Edit'
import {
  AcademicCalendarEventFormType,
  createResolver,
} from '~/pages/admin/MasterTahunAjaran/ManageAcademicCalendar/Create/form'
import { ActionDataAdminMasterTahunAjaranAcademicCalendarEventEdit } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterTahunAjaranManageAcademicCalendarEdit } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import GCalUtils from '~/thirdparty/utils/google-calendar.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterTahunAjaranManageAcademicCalendar
}

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderDataAdminMasterTahunAjaranManageAcademicCalendarEdit> {
  const tahunAjaranId = params.tahunAjaranId as TahunAjaran['id'] | null
  const eventId = params.eventId as AcademicCalendarEvent['id'] | null

  const [tahunAjaran, academicCalendarEvent] = await Promise.all([
    prisma.tahunAjaran.findUnique({ where: { id: tahunAjaranId ?? '' } }),
    prisma.academicCalendarEvent.findUnique({ where: { id: eventId ?? '' } }),
  ])

  return { tahunAjaran, academicCalendarEvent }
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataAdminMasterTahunAjaranAcademicCalendarEventEdit> {
  const tahunAjaranId = params.tahunAjaranId as TahunAjaran['id'] | null
  const eventId = params.eventId as AcademicCalendarEvent['id'] | null

  const [tahunAjaran, existing] = await Promise.all([
    prisma.tahunAjaran.findUnique({ where: { id: tahunAjaranId ?? '' } }),
    prisma.academicCalendarEvent.findUnique({ where: { id: eventId ?? '' } }),
  ])

  const tahunMulaiStr = format(tahunAjaran?.tahunMulai ?? new Date(), constants.dateFormats.rawDateInput)
  const tahunBerakhirStr = format(tahunAjaran?.tahunBerakhir ?? new Date(), constants.dateFormats.rawDateInput)

  const { errors, data } = await getValidatedFormData<AcademicCalendarEventFormType>(
    request,
    createResolver(tahunMulaiStr, tahunBerakhirStr),
  )
  if (errors) {
    return { success: false, message: JSON.stringify(errors), error: errors, data: {} }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const updated = await prisma.academicCalendarEvent
      .update({
        where: { id: eventId ?? '' },
        data: {
          title: data.title,
          description: data.description || null,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          isAllDay: true,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .catch(error => {
        throw prismaErrorHandler(error)
      })

    try {
      const gcalPayload = {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
      }

      if (existing?.googleEventId) {
        await GCalUtils.updateCalendarEvent(existing.googleEventId, gcalPayload)
      } else {
        const gcalEvent = await GCalUtils.addCalendarEvent(gcalPayload)
        if (gcalEvent.id) {
          await prisma.academicCalendarEvent.update({
            where: { id: updated.id },
            data: { googleEventId: gcalEvent.id },
          })
        }
      }
    } catch (gcalError) {
      console.error('[GCal] Failed to sync Google Calendar event on update:', gcalError)
    }

    return {
      success: true,
      message: 'Academic calendar event updated!',
      data: { updatedEvent: updated },
    }
  } catch (error) {
    return {
      success: false,
      error,
      message: (error as { message?: string }).message ?? 'Unknown Error!',
      data: {},
    }
  }
}

export default function AdminMasterTahunAjaranManageAcademicCalendarEditRoute() {
  return <AdminMasterTahunAjaranManageAcademicCalendarEditPage />
}
