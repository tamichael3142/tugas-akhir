import {
  Assignment,
  AssignmentSubmission,
  AssignmentSubmissionStatus,
  AssignmentSubmissionType,
  Kelas,
  MataPelajaran,
  SemesterAjaran,
  SemesterAjaranUrutan,
} from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { ActionDataSiswaKelasDetailMataPelajaranDetailAssignmentSubmission } from '~/types/actions-data/siswa'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { LoaderDataSiswaKelasDetailMataPelajaranDetailAssignmentDetail } from '~/types/loaders-data/siswa'
import SiswaKelasDetailMataPelajaranDetailAssignmentDetailPage from '~/pages/siswa/Kelas/Detail/MataPelajaran/Detail/Assignment/Detail'
import assignmentSubmissionStorageManager from '~/storage-manager/assignmentSubmission.storageManager.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaMapelAssignment
}
export async function loader({
  params,
  request,
}: LoaderFunctionArgs): Promise<LoaderDataSiswaKelasDetailMataPelajaranDetailAssignmentDetail> {
  const userId = await requireAuthCookie(request)
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

  const currentTahunAjaran = kelas?.tahunAjaran

  const currentSemesterUrutan = new Date().getMonth() < 6 ? SemesterAjaranUrutan.DUA : SemesterAjaranUrutan.SATU
  let currentSemester: SemesterAjaran | null = null

  if (currentTahunAjaran) {
    currentSemester = currentTahunAjaran.semesterAjaran.find(item => item.urutan === currentSemesterUrutan) ?? null
  }

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
  })

  const assignmentSubmission = await prisma.assignmentSubmission.findUnique({
    where: { assignmentId_siswaId: { assignmentId: assignment?.id ?? '', siswaId: userId } },
  })

  const storageManager = assignmentSubmissionStorageManager()

  return {
    kelas,
    currentTahunAjaran,
    currentSemester,
    mataPelajaran,
    assignment,
    assignmentSubmission: assignmentSubmission
      ? {
          ...assignmentSubmission,
          fileDownloadUrl: assignmentSubmission.fileObjectPath
            ? await storageManager.getDownloadUrl({ fullPath: assignmentSubmission.fileObjectPath })
            : undefined,
        }
      : null,
  } as LoaderDataSiswaKelasDetailMataPelajaranDetailAssignmentDetail
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataSiswaKelasDetailMataPelajaranDetailAssignmentSubmission> {
  const userId = await requireAuthCookie(request)

  const kelasId = params.kelasId as Kelas['id'] | null
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null
  const assignmentId = params.assignmentId as Assignment['id'] | null

  const formData = await request.formData()
  const submissionId = (formData.has('id') ? formData.get('id') : undefined) as string | undefined
  const answer = formData.get('answer') as string | null
  const file = formData.get('file') as File | null
  const remarksSiswa = formData.get('remarksSiswa') as string | null
  const newDate = new Date()
  const submissionStatus = AssignmentSubmissionStatus.SUBMITTED

  try {
    const currAssignment = await prisma.assignment.findUnique({ where: { id: assignmentId ?? '' } })

    if (!assignmentId || !currAssignment)
      throw {
        message: 'Tugas tidak ditemukan!',
      }

    let currSubmission
    if (submissionId)
      currSubmission = await prisma.assignmentSubmission.findUnique({
        where: { id: Number(submissionId) ?? -1, siswaId: userId },
      })

    if (currSubmission && !currSubmission)
      throw {
        message: 'Submission tidak ditemukan!',
      }

    let newData: Partial<Omit<AssignmentSubmission, 'id' | 'siswaId' | 'assignmentId'>> = {}

    if (currAssignment.submissionType === AssignmentSubmissionType.FILE_UPLOAD) {
      let uploadedFileInfo

      if (file && file.size > 0) {
        const storageManager = assignmentSubmissionStorageManager()

        if (currSubmission?.fileObjectPath)
          await storageManager.deleteFile({ fullPath: currSubmission?.fileObjectPath })

        uploadedFileInfo = await storageManager.upload({
          file: file,
          kelasId: kelasId ?? '',
          mataPelajaranId: mataPelajaranId ?? '',
          assignmentSubmissionId: submissionId ? String(submissionId) : undefined,
          assignmentId: currAssignment.id,
        })
      }

      newData = {
        fileObjectPath: uploadedFileInfo?.path,
        remarksSiswa,
        submissionStatus,
      }
    } else if (currAssignment.submissionType === AssignmentSubmissionType.LONG_TEXT) {
      newData = {
        answer: answer,
        remarksSiswa,
        submissionStatus,
      }
    } else if (currAssignment.submissionType === AssignmentSubmissionType.TIME_STAMP) {
      newData = {
        remarksSiswa,
        submissionStatus,
      }
    }

    return await prisma.assignmentSubmission
      .upsert({
        where: { assignmentId_siswaId: { assignmentId, siswaId: userId } },
        create: { ...newData, assignmentId, siswaId: userId, createdAt: newDate },
        update: { ...newData, updatedAt: newDate },
      })
      .then(result => {
        return {
          success: true,
          message: 'Submission berhasil tersimpan!',
          data: {
            updatedAssignmentSubmission: result,
          },
        }
      })
      .catch(error => {
        const prismaError = prismaErrorHandler(error)
        throw prismaError
      })
  } catch (error) {
    console.log(error)
    return {
      success: false,
      error: error,
      message: (error as { message?: string }).message ?? 'Unknown Error!',
      data: {
        oldFormData: {
          answer,
          file,
          remarksSiswa,
        },
      },
    }
  }
}

export default function SiswaKelasDetailMataPelajaranDetailAssignmentDetailRoute() {
  return <SiswaKelasDetailMataPelajaranDetailAssignmentDetailPage />
}
