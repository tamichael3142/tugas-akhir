import { Kelas, MataPelajaran } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import GuruReportDescriptionsPage from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/ReportDescriptions'
import {
  GuruReportDescriptionsFormType,
  resolver,
} from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/ReportDescriptions/form'
import { ActionDataGuruReportDescriptions } from '~/types/actions-data/guru'
import { LoaderDataGuruReportDescriptions } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruReportDescriptions
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataGuruReportDescriptions> {
  const kelasId = params.kelasId as Kelas['id']
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id']

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId },
    include: {
      tahunAjaran: { include: { semesterAjaran: true } },
      wali: true,
    },
  })

  const mataPelajaran = await prisma.mataPelajaran.findUnique({
    where: { id: mataPelajaranId },
    include: {
      guru: true,
      semesterAjaran: { include: { tahunAjaran: true } },
    },
  })

  const semesterAjaranId = mataPelajaran?.semesterAjaranId ?? null

  const reportConfig =
    kelasId && semesterAjaranId
      ? await prisma.reportConfig.findUnique({
          where: { kelasId_semesterAjaranId: { kelasId, semesterAjaranId } },
        })
      : null

  const siswaPerKelasPerSemesters = semesterAjaranId
    ? await prisma.siswaPerKelasDanSemester.findMany({
        where: { kelasId, semesterAjaranId },
        include: { siswa: true },
        orderBy: [{ nomorAbsen: 'asc' }, { siswa: { firstName: 'asc' } }],
      })
    : []

  const siswaIds = siswaPerKelasPerSemesters.map(s => s.siswaId)

  const studentSubjectReports = semesterAjaranId
    ? await prisma.studentSubjectReport.findMany({
        where: { siswaId: { in: siswaIds }, semesterAjaranId, mataPelajaranId },
      })
    : []

  return {
    kelas: kelas!,
    mataPelajaran: mataPelajaran!,
    reportConfig,
    siswaPerKelasPerSemesters,
    studentSubjectReports,
    semesterAjaranId,
  } as LoaderDataGuruReportDescriptions
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataGuruReportDescriptions> {
  const { errors, data } = await getValidatedFormData<GuruReportDescriptionsFormType>(request, resolver)
  if (errors) {
    return { success: false, error: errors, data: {} }
  }

  await requireAuthCookie(request)

  try {
    await prisma.$transaction(async tx => {
      for (const row of data.descriptions) {
        const { siswaId, semesterAjaranId, mataPelajaranId, description } = row

        if (!siswaId || !semesterAjaranId || !mataPelajaranId) continue

        await tx.studentSubjectReport.upsert({
          where: {
            siswaId_semesterAjaranId_mataPelajaranId: {
              siswaId,
              semesterAjaranId,
              mataPelajaranId,
            },
          },
          create: { siswaId, semesterAjaranId, mataPelajaranId, description: description ?? null },
          update: { description: description ?? null, updatedAt: new Date() },
        })
      }
    })

    return { success: true, message: 'Descriptions saved!', data: {} }
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

export default function GuruReportDescriptionsRoute() {
  return <GuruReportDescriptionsPage />
}
