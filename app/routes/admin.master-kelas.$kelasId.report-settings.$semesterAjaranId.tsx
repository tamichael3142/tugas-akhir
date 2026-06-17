import { Kelas, SemesterAjaran } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { ReportStatus } from '~/database/enums/prisma.enums'
import AdminMasterKelasReportSettingsPage from '~/pages/admin/MasterKelas/ReportSettings'
import { AdminMasterKelasReportSettingsFormType, resolver } from '~/pages/admin/MasterKelas/ReportSettings/form'
import { ActionDataAdminMasterKelasReportSettings } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterKelasReportSettings } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterKelasReportSettings
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterKelasReportSettings> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const semesterAjaranId = params.semesterAjaranId as SemesterAjaran['id'] | null

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId ?? '' },
    include: {
      tahunAjaran: { include: { semesterAjaran: true } },
      wali: true,
    },
  })

  const semesterAjaran = await prisma.semesterAjaran.findUnique({
    where: { id: semesterAjaranId ?? '' },
  })

  const reportConfig =
    kelasId && semesterAjaranId
      ? await prisma.reportConfig.findUnique({
          where: { kelasId_semesterAjaranId: { kelasId, semesterAjaranId } },
        })
      : null

  return { kelas, semesterAjaran, reportConfig }
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataAdminMasterKelasReportSettings> {
  const { errors, data } = await getValidatedFormData<AdminMasterKelasReportSettingsFormType>(request, resolver)
  if (errors) {
    return { success: false, error: errors, data: {} }
  }

  await requireAuthCookie(request)

  try {
    const kelasId = params.kelasId as Kelas['id'] | null
    const semesterAjaranId = params.semesterAjaranId as SemesterAjaran['id'] | null

    if (!kelasId || !semesterAjaranId) {
      throw { code: 404, message: 'Class or semester not found!' }
    }

    console.log(data.status)

    await prisma.reportConfig.upsert({
      where: { kelasId_semesterAjaranId: { kelasId, semesterAjaranId } },
      create: {
        kelasId,
        semesterAjaranId,
        status: data.status as ReportStatus,
      },
      update: {
        status: data.status as ReportStatus,
        updatedAt: new Date(),
      },
    })

    return { success: true, message: 'Report settings updated!', data: {} }
  } catch (error) {
    const prismaError = prismaErrorHandler(error)
    return {
      success: false,
      error: prismaError,
      message: (prismaError as { message?: string }).message ?? 'Unknown Error!',
      data: {},
    }
  }
}

export default function AdminMasterKelasReportSettingsRoute() {
  return <AdminMasterKelasReportSettingsPage />
}
