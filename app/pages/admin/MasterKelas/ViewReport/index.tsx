import { useLoaderData, useRevalidator, useParams } from '@remix-run/react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import { LoaderDataAdminMasterKelasViewReport, StudentReportData } from '~/types/loaders-data/admin'
import { Button } from '~/components/forms'
import AppNav from '~/navigation'
import { FaFilePdf } from 'react-icons/fa6'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import EnumsTitleUtils from '~/utils/enums-title.utils'

const sectionPrefix = 'admin-master-kelas-view-report'

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className='flex gap-2 text-sm'>
      <span className='w-36 text-gray-500 shrink-0'>{label}</span>
      <span className='text-gray-400'>:</span>
      <span className='font-medium'>{value ?? '-'}</span>
    </div>
  )
}

function AcademicTable({ data }: { data: StudentReportData }) {
  return (
    <div className='overflow-x-auto'>
      <table className='table w-full box-border'>
        <thead>
          <tr className='bg-neutral-100'>
            <th className='w-8 border p-2'>No</th>
            <th className='border p-2'>Subject</th>
            <th className='w-16 text-center border p-2'>KKM</th>
            <th className='w-20 text-center border p-2'>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.academicAssessments.map((item, idx) => {
            const finalScore = item.penilaians.find(p => p.kompetensi.id === 'FS')
            return (
              <tr key={item.mataPelajaran.id}>
                <td className='text-center border p-2'>{idx + 1}</td>
                <td className='border p-2'>{item.mataPelajaran.nama}</td>
                <td className='text-center border p-2'>{item.kkm}</td>
                <td className='text-center border p-2'>{finalScore?.nilai?.toString() ?? '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ExtracurricularTable({ data }: { data: StudentReportData }) {
  if (data.extracurricularAssessments.length === 0) return null
  return (
    <div className='overflow-x-auto'>
      <table className='table table-xs w-full border border-base-300'>
        <thead>
          <tr className='bg-neutral-100'>
            <th className='w-8 border p-2'>No</th>
            <th className='border p-2'>Activity</th>
            <th className='w-20 text-center border p-2'>Grade</th>
          </tr>
        </thead>
        <tbody>
          {data.extracurricularAssessments.map((item, idx) => {
            const finalScore = item.penilaians.find(p => p.kompetensiEkstrakulikulerId === 'FS')
            return (
              <tr key={item.ekstrakulikuler.id}>
                <td className='border p-2'>{idx + 1}</td>
                <td className='border p-2'>{item.ekstrakulikuler.nama}</td>
                <td className='text-center border p-2'>{finalScore?.nilai?.toString() ?? '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function CompetencyTable({ data }: { data: StudentReportData }) {
  return (
    <div className='overflow-x-auto'>
      <table className='table table-xs w-full border border-base-300'>
        <thead>
          <tr className='bg-neutral-100'>
            <th className='w-8 border p-2'>No</th>
            <th className='w-32 border p-2'>Subject</th>
            <th className='border p-2'>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.competencyDescriptions.map((item, idx) => (
            <tr key={item.id}>
              <td className='border p-2 text-center'>{idx + 1}</td>
              <td className='border p-2'>{item.mataPelajaran.nama}</td>
              <td className='whitespace-pre-wrap border p-2'>{item.description ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminMasterKelasViewReportPage() {
  const loader = useLoaderData<LoaderDataAdminMasterKelasViewReport>()
  const revalidator = useRevalidator()
  const params = useParams()

  const kelasId = params.kelasId as string
  const semesterAjaranId = params.semesterAjaranId as string
  const siswaId = params.siswaId as string

  const report = loader.reportData
  const semLabel = report
    ? `${EnumsTitleUtils.getSemesterAjaranUrutan(report.semesterAjaran.urutan as SemesterAjaranUrutan)}`
    : '-'

  if (revalidator.state === 'loading') return <LoadingFullScreen />

  return (
    <AdminPageContainer
      key={sectionPrefix}
      title='View Student Report'
      actions={[
        <a
          key={`${sectionPrefix}-pdf`}
          href={AppNav.admin.masterKelasGenerateReport({ id: kelasId, semesterAjaranId, siswaId })}
          target='_blank'
          rel='noreferrer'
        >
          <Button label='Generate PDF' color='secondary' startIcon={<FaFilePdf />} />
        </a>,
        <BackButton key={`${sectionPrefix}-back`} />,
      ]}
    >
      {!report ? (
        <Card>
          <p className='text-gray-500'>Report data not available.</p>
        </Card>
      ) : (
        <div className='space-y-4 md:space-y-8 pb-56'>
          {/* Header */}
          <Card>
            <div className='text-center mb-4'>
              <h2 className='text-xl font-bold'>{report.schoolName}</h2>
              <p className='text-sm text-gray-500'>{report.schoolAddress}</p>
              <p className='text-sm text-gray-500'>{report.schoolPhone}</p>
            </div>
            <div className='divider my-2' />
            <h3 className='text-lg font-bold text-center mb-1'>SEMESTER REPORT CARD</h3>
            <p className='text-center text-sm text-gray-500 mb-4'>
              ACADEMIC YEAR {report.semesterAjaran.tahunAjaran.nama}
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
              <InfoRow label='Student Name' value={`${report.student.firstName} ${report.student.lastName}`} />
              <InfoRow label='Class / Student ID' value={`${report.kelas.nama} / ${report.student.username}`} />
              <InfoRow label='Attendance Number' value={report.nomorAbsen} />
              <InfoRow label='Semester' value={semLabel} />
            </div>
          </Card>

          {/* Academic Assessment */}
          <Card>
            <h4 className='font-semibold mb-3'>Academic Assessment</h4>
            <AcademicTable data={report} />
          </Card>

          {/* Extracurricular */}
          {report.extracurricularAssessments.length > 0 && (
            <Card>
              <h4 className='font-semibold mb-3'>Self Development / Extracurricular</h4>
              <ExtracurricularTable data={report} />
            </Card>
          )}

          <Card>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                {/* Attendance */}
                <h4 className='font-semibold mb-3'>Attendance</h4>

                <div className='overflow-x-auto'>
                  <table className='table w-full box-border'>
                    <tbody>
                      <tr>
                        <td className='border p-2'>Sick</td>
                        <td className='border p-2'>{report.attendanceSummary.sick}</td>
                      </tr>
                      <tr>
                        <td className='border p-2'>Excused</td>
                        <td className='border p-2'>{report.attendanceSummary.excused}</td>
                      </tr>
                      <tr>
                        <td className='border p-2'>Unexcused</td>
                        <td className='border p-2'>{report.attendanceSummary.unexcused}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                {/* Homeroom Notes */}
                <h4 className='font-semibold mb-3'>Homeroom Teacher Notes</h4>
                <div className='border p-4 min-h-20 whitespace-pre-wrap text-sm'>
                  {report.homeroomTeacherNote ?? <span className='text-gray-400 italic'>No note written yet.</span>}
                </div>
              </div>
            </div>
          </Card>

          {/* Competency Descriptions */}
          <Card>
            <h3 className='text-lg font-bold text-center mb-1'>COMPETENCY ACHIEVEMENT DESCRIPTIONS</h3>
            <p className='text-center text-sm text-gray-500 mb-4'>
              ACADEMIC YEAR {report.semesterAjaran.tahunAjaran.nama}
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-1 mb-4'>
              <InfoRow label='Student Name' value={`${report.student.firstName} ${report.student.lastName}`} />
              <InfoRow label='Class / Student ID' value={`${report.kelas.nama} / ${report.student.username}`} />
              <InfoRow label='Attendance Number' value={report.nomorAbsen} />
              <InfoRow label='Semester' value={semLabel} />
            </div>
            <CompetencyTable data={report} />
          </Card>

          {/* Signature */}
          <Card>
            <div className='grid grid-cols-3 gap-4 text-center'>
              <div>
                <p className='text-sm text-gray-500'>Principal</p>
                <div className='mt-16 border-b border-gray-400 mx-4' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Parent / Guardian</p>
                <div className='mt-16 border-b border-gray-400 mx-4' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Homeroom Teacher</p>
                <div className='mt-16 border-b border-gray-400 mx-4' />
                <p className='text-sm font-semibold mt-1'>
                  {report.kelas.wali ? `${report.kelas.wali.firstName} ${report.kelas.wali.lastName}` : '-'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </AdminPageContainer>
  )
}
