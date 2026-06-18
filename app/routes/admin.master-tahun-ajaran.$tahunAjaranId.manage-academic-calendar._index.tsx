import { TahunAjaran } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import AdminMasterTahunAjaranManageAcademicCalendarPage from '~/pages/admin/MasterTahunAjaran/ManageAcademicCalendar'
import { LoaderDataAdminMasterTahunAjaranManageAcademicCalendar } from '~/types/loaders-data/admin'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterTahunAjaranManageAcademicCalendar
}

export async function loader({
  params,
  request,
}: LoaderFunctionArgs): Promise<LoaderDataAdminMasterTahunAjaranManageAcademicCalendar> {
  const tahunAjaranId = params.tahunAjaranId as TahunAjaran['id'] | null
  const tahunAjaran = await prisma.tahunAjaran.findUnique({ where: { id: tahunAjaranId ?? '' } })

  const academicCalendarEvents = await getPaginatedData({
    request,
    model: prisma.academicCalendarEvent,
    options: {
      where: { tahunAjaranId: tahunAjaranId ?? '' },
      defaultLimit: 20,
      orderBy: [{ startDate: 'asc' }],
    },
  })

  return { tahunAjaran, academicCalendarEvents }
}

export default function AdminMasterTahunAjaranManageAcademicCalendarRoute() {
  return <AdminMasterTahunAjaranManageAcademicCalendarPage />
}
