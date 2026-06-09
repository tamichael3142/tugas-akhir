import { Assignment, AssignmentSubmissionStatus, AssignmentSubmissionType, Kelas, MataPelajaran } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail } from '~/types/loaders-data/guru'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentScoreSubmission } from '~/types/actions-data/guru'
import { prisma } from '~/utils/db.server'
import GuruDaftarKelasDetailMataPelajaranDetailAssignmentDetailPage from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Assignment/Detail'
import assignmentSubmissionStorageManager from '~/storage-manager/assignmentSubmission.storageManager.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import DBUtils from '~/database/utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageAssignment
}
export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null
  const assignmentId = params.assignmentId as Assignment['id'] | null

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId ?? '' },
    include: {
      tahunAjaran: {
        include: {
          semesterAjaran: true,
        },
      },
      wali: true,
    },
  })

  const mataPelajaran = await prisma.mataPelajaran.findUnique({
    where: { id: mataPelajaranId ?? '' },
    include: {
      semesterAjaran: {
        include: {
          tahunAjaran: true,
        },
      },
      guru: true,
    },
  })

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId ?? '' },
    include: { connectedKompetensi: true },
  })

  const siswaPerKelasPerSemesters = await prisma.siswaPerKelasDanSemester.findMany({
    where: {
      kelasId: kelasId ?? undefined,
      semesterAjaranId: mataPelajaran?.semesterAjaranId,
    },
    include: {
      siswa: true,
    },
  })

  const storageManager = assignmentSubmissionStorageManager()

  const assignmentSubmissions = await prisma.assignmentSubmission
    .findMany({
      where: { assignmentId: assignmentId ?? '' },
      include: {
        siswa: true,
      },
    })
    .then(async res => {
      const newData: typeof res = []
      for (let i = 0; i < res.length; i++) {
        const currData = res[i]
        newData.push({
          ...currData,
          fileDownloadUrl:
            assignment?.submissionType === AssignmentSubmissionType.FILE_UPLOAD && currData.fileObjectPath
              ? await storageManager.getDownloadUrl({ fullPath: currData.fileObjectPath })
              : null,
        })
      }
      return newData
    })

  const penilaians = assignment?.connectedKompetensiId
    ? await prisma.penilaian
        .findMany({
          where: {
            kelasId: kelasId ?? undefined,
            mataPelajaranId: mataPelajaranId ?? undefined,
            kompetensiId: assignment.connectedKompetensiId,
          },
        })
        .then(rows =>
          rows.map(item => ({
            ...item,
            nilai: DBUtils.decimal.decimalToNumber(item.nilai),
          })),
        )
    : []

  return {
    kelas,
    mataPelajaran,
    assignment,
    siswaPerKelasPerSemesters,
    assignmentSubmissions,
    penilaians,
  } as LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentScoreSubmission> {
  const formData = await request.formData()
  const submissionId = Number(formData.get('submissionId'))
  const nilai = Number(formData.get('nilai'))

  if (!submissionId || isNaN(nilai) || nilai < 0 || nilai > 100) {
    return { success: false, message: 'Invalid submission or assessment value.', data: {} }
  }

  try {
    const kelasId = params.kelasId as Kelas['id'] | null
    const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null
    const assignmentId = params.assignmentId as Assignment['id'] | null

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId ?? '' },
    })

    if (!assignment?.connectedKompetensiId) {
      throw { message: 'This assignment has no connected Kompetensi.' }
    }

    const submission = await prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
    })

    if (!submission) {
      throw { message: 'Submission not found.' }
    }

    await prisma.$transaction([
      prisma.penilaian.upsert({
        where: {
          kelasId_mataPelajaranId_kompetensiId_siswaId: {
            kelasId: kelasId ?? '',
            mataPelajaranId: mataPelajaranId ?? '',
            kompetensiId: assignment.connectedKompetensiId,
            siswaId: submission.siswaId,
          },
        },
        create: {
          kelasId: kelasId ?? '',
          mataPelajaranId: mataPelajaranId ?? '',
          kompetensiId: assignment.connectedKompetensiId,
          siswaId: submission.siswaId,
          nilai: nilai,
          createdAt: new Date(),
        },
        update: {
          nilai: nilai,
          updatedAt: new Date(),
        },
      }),
      prisma.assignmentSubmission.update({
        where: { id: submissionId },
        data: {
          submissionStatus: AssignmentSubmissionStatus.SCORED,
          updatedAt: new Date(),
        },
      }),
    ])

    return { success: true, message: 'Assessment saved!', data: {} }
  } catch (error) {
    const prismaError = prismaErrorHandler(error)
    return {
      success: false,
      message: prismaError.message ?? 'Unknown Error!',
      data: {},
    }
  }
}

export default function GuruDaftarKelasDetailMataPelajaranDetailAssignmentDetailRoute() {
  return <GuruDaftarKelasDetailMataPelajaranDetailAssignmentDetailPage />
}
