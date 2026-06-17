import { Akun, Kelas, SemesterAjaran } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { renderToBuffer } from '@react-pdf/renderer'
import StudentReportPDF from '~/components/pdf/StudentReportPDF'
import { buildStudentReportData } from '~/utils/report-builder.server'
import React from 'react'

export async function loader({ params }: LoaderFunctionArgs) {
  const kelasId = params.kelasId as Kelas['id']
  const semesterAjaranId = params.semesterAjaranId as SemesterAjaran['id']
  const siswaId = params.siswaId as Akun['id']

  const reportData = await buildStudentReportData(siswaId, semesterAjaranId, kelasId)

  if (!reportData) {
    return new Response('Report data not found', { status: 404 })
  }

  const element = React.createElement(StudentReportPDF, { data: reportData })
  const pdfBuffer = await renderToBuffer(element as unknown as Parameters<typeof renderToBuffer>[0])

  const studentName = `${reportData.student.firstName}_${reportData.student.lastName}`.replace(/\s+/g, '_')
  const filename = `Report_${studentName}_${reportData.kelas.nama}_${reportData.semesterAjaran.tahunAjaran.nama}.pdf`
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_.-]/g, '')

  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
