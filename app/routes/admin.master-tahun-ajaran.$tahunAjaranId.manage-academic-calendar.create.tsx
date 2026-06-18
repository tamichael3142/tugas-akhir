import { TahunAjaran } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { format } from 'date-fns'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import AdminMasterTahunAjaranManageAcademicCalendarCreatePage from '~/pages/admin/MasterTahunAjaran/ManageAcademicCalendar/Create'
import {
  AcademicCalendarEventFormType,
  createResolver,
} from '~/pages/admin/MasterTahunAjaran/ManageAcademicCalendar/Create/form'
import { ActionDataAdminMasterTahunAjaranAcademicCalendarEventCreate } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterTahunAjaranManageAcademicCalendarCreate } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import GCalUtils from '~/thirdparty/utils/google-calendar.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterTahunAjaranManageAcademicCalendar
}

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderDataAdminMasterTahunAjaranManageAcademicCalendarCreate> {
  const tahunAjaranId = params.tahunAjaranId as TahunAjaran['id'] | null
  const tahunAjaran = await prisma.tahunAjaran.findUnique({ where: { id: tahunAjaranId ?? '' } })
  return { tahunAjaran }
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataAdminMasterTahunAjaranAcademicCalendarEventCreate> {
  const tahunAjaranId = params.tahunAjaranId as TahunAjaran['id'] | null
  const tahunAjaran = await prisma.tahunAjaran.findUnique({ where: { id: tahunAjaranId ?? '' } })

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
    const created = await prisma.academicCalendarEvent
      .create({
        data: {
          title: data.title,
          description: data.description || null,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          isAllDay: true,
          tahunAjaranId: tahunAjaranId ?? '',
          createdById: currUser?.id,
        },
      })
      .catch(error => {
        throw prismaErrorHandler(error)
      })

    try {
      const gcalEvent = await GCalUtils.addCalendarEvent({
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
      })

      if (gcalEvent.id) {
        await prisma.academicCalendarEvent.update({
          where: { id: created.id },
          data: { googleEventId: gcalEvent.id },
        })
      }
    } catch (gcalError) {
      console.error('[GCal] Failed to create Google Calendar event:', gcalError)
    }

    return {
      success: true,
      message: 'Academic calendar event created!',
      data: { createdEvent: created },
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

export default function AdminMasterTahunAjaranManageAcademicCalendarCreateRoute() {
  return <AdminMasterTahunAjaranManageAcademicCalendarCreatePage />
}
