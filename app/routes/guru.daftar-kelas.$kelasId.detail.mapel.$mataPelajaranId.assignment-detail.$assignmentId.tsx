import { Assignment, AssignmentSubmissionType, Kelas, MataPelajaran } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'
import GuruDaftarKelasDetailMataPelajaranDetailAssignmentDetailPage from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Assignment/Detail'
import assignmentSubmissionStorageManager from '~/storage-manager/assignmentSubmission.storageManager.server'

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

  return {
    kelas,
    mataPelajaran,
    assignment,
    siswaPerKelasPerSemesters,
    assignmentSubmissions,
  } as LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail
}

export default function GuruDaftarKelasDetailMataPelajaranDetailAssignmentDetailRoute() {
  return <GuruDaftarKelasDetailMataPelajaranDetailAssignmentDetailPage />
}
