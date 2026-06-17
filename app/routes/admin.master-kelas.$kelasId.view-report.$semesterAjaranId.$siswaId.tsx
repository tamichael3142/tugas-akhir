import { Akun, Kelas, SemesterAjaran } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import AdminMasterKelasViewReportPage from '~/pages/admin/MasterKelas/ViewReport'
import { LoaderDataAdminMasterKelasViewReport } from '~/types/loaders-data/admin'
import { prisma } from '~/utils/db.server'
import { buildStudentReportData } from '~/utils/report-builder.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterKelasViewReport
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterKelasViewReport> {
  const kelasId = params.kelasId as Kelas['id']
  const semesterAjaranId = params.semesterAjaranId as SemesterAjaran['id']
  const siswaId = params.siswaId as Akun['id']

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId },
    include: {
      tahunAjaran: { include: { semesterAjaran: true } },
      wali: true,
    },
  })

  const reportData = await buildStudentReportData(siswaId, semesterAjaranId, kelasId)

  return { kelas, reportData }
}

export default function AdminMasterKelasViewReportRoute() {
  return <AdminMasterKelasViewReportPage />
}
