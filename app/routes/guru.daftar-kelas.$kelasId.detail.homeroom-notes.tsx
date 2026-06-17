import { Kelas } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruHomeroomNotesPage from '~/pages/guru/DaftarKelas/Detail/HomeroomNotes'
import { LoaderDataGuruHomeroomNotes } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruHomeroomNotes
}

export async function loader({ params, request }: LoaderFunctionArgs): Promise<LoaderDataGuruHomeroomNotes> {
  const kelasId = params.kelasId as Kelas['id']
  const url = new URL(request.url)
  const semesterAjaranId = url.searchParams.get('semesterAjaranId')

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId },
    include: {
      tahunAjaran: { include: { semesterAjaran: true } },
      wali: true,
    },
  })

  const resolvedSemesterAjaranId = semesterAjaranId ?? kelas?.tahunAjaran.semesterAjaran[0]?.id ?? null

  const reportConfig =
    kelasId && resolvedSemesterAjaranId
      ? await prisma.reportConfig.findUnique({
          where: {
            kelasId_semesterAjaranId: { kelasId, semesterAjaranId: resolvedSemesterAjaranId },
          },
        })
      : null

  const siswaPerKelasPerSemesters = resolvedSemesterAjaranId
    ? await prisma.siswaPerKelasDanSemester.findMany({
        where: { kelasId, semesterAjaranId: resolvedSemesterAjaranId },
        include: { siswa: true },
        orderBy: [{ nomorAbsen: 'asc' }, { siswa: { firstName: 'asc' } }],
      })
    : []

  const siswaIds = siswaPerKelasPerSemesters.map(s => s.siswaId)

  const studentReports = resolvedSemesterAjaranId
    ? await prisma.studentReport.findMany({
        where: { siswaId: { in: siswaIds }, semesterAjaranId: resolvedSemesterAjaranId },
      })
    : []

  return {
    kelas,
    reportConfig,
    siswaPerKelasPerSemesters,
    studentReports,
    selectedSemesterAjaranId: resolvedSemesterAjaranId,
  }
}

export default function GuruHomeroomNotesRoute() {
  return <GuruHomeroomNotesPage />
}
