import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { Card, LoadingFullScreen } from '~/components/ui'
import { ReportStatus, SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import { LoaderDataGuruHomeroomNotes } from '~/types/loaders-data/guru'
import GuruDaftarKelasDetailTab, { TabKey } from '../_components/Tab'
import AppNav from '~/navigation'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { StaticSelect } from '~/components/forms'
import { FaEdit } from 'react-icons/fa'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'

const sectionPrefix = 'guru-homeroom-notes'

export default function GuruHomeroomNotesPage() {
  const loader = useLoaderData<LoaderDataGuruHomeroomNotes>()
  const revalidator = useRevalidator()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const isReadOnly =
    !loader.reportConfig ||
    loader.reportConfig.status === ReportStatus.DRAFT ||
    loader.reportConfig.status === ReportStatus.CLOSED

  const semesterOptions =
    loader.kelas?.tahunAjaran.semesterAjaran.map(s => ({
      value: s.id,
      label: `${EnumsTitleUtils.getSemesterAjaranUrutan(s.urutan as SemesterAjaranUrutan)} Semester`,
    })) ?? []

  const selectedSemesterAjaranId = loader.selectedSemesterAjaranId ?? semesterOptions[0]?.value ?? ''

  const reportStatusBadge: Record<string, string> = {
    DRAFT: 'text-neutrals-black',
    OPEN: 'text-green-500',
    CLOSED: 'text-red-500',
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card key={sectionPrefix} className='p-0! mt-4 lg:mt-8'>
      <GuruDaftarKelasDetailTab activeTabKey={TabKey.HOMEROOM_NOTES} kelas={loader.kelas ?? undefined} />

      <div className='p-4 md:p-8'>
        <div className='flex items-center justify-between mb-4'>
          <div className=''>
            <h4 className='font-semibold text-lg'>Student Reports</h4>
            {loader.reportConfig && (
              <p className={`${reportStatusBadge[loader.reportConfig.status] ?? ''}`}>
                Status: {EnumsTitleUtils.reportStatus(loader.reportConfig.status as never)}
              </p>
            )}
          </div>
          <div className='w-44'>
            <StaticSelect
              label=''
              options={semesterOptions}
              selectProps={{
                value: selectedSemesterAjaranId,
                onChange: e => {
                  const params = new URLSearchParams(searchParams)
                  params.set('semesterAjaranId', e.target.value)
                  navigate(`?${params.toString()}`, { replace: true })
                },
              }}
            />
          </div>
        </div>

        {isReadOnly && (
          <div className='bg-secondary/10 border border-secondary text-secondary p-2 rounded-xl mb-4'>
            <span>
              {!loader.reportConfig || loader.reportConfig.status === ReportStatus.DRAFT
                ? 'Report period is not open yet. You cannot edit notes at this time.'
                : 'Report period is closed. Notes are read-only.'}
            </span>
          </div>
        )}

        <div className='overflow-x-auto'>
          <table className='table w-full box-border'>
            <thead>
              <tr className='bg-neutral-100'>
                <th className='w-8 border p-2'>No</th>
                <th className='border p-2'>Student Name</th>
                <th className='border p-2'>Note Status</th>
                {!isReadOnly && <th className='w-24 border p-2'>Action</th>}
              </tr>
            </thead>
            <tbody>
              {loader.siswaPerKelasPerSemesters.length === 0 ? (
                <tr>
                  <td colSpan={4} className='text-center text-gray-400 py-8 border p-2'>
                    No students found for this semester.
                  </td>
                </tr>
              ) : (
                loader.siswaPerKelasPerSemesters.map((spks, idx) => {
                  const report = loader.studentReports.find(r => r.siswaId === spks.siswaId)

                  return (
                    <tr key={spks.siswaId}>
                      <td className='border p-2 text-center'>{idx + 1}</td>
                      <td className='border p-2'>
                        {spks.siswa.firstName} {spks.siswa.lastName}
                      </td>
                      <td className='border p-2'>{report?.homeroomTeacherNote}</td>
                      {!isReadOnly && (
                        <td className='border p-2 flex flex-row items-center justify-center gap-2'>
                          <DataGridActionButton
                            color='secondary'
                            icon={<FaEdit />}
                            label='Edit'
                            buttonProps={{
                              onClick: () =>
                                navigate(
                                  AppNav.guru.daftarKelasDetailHomeroomNotesEdit({
                                    kelasId: loader.kelas!.id,
                                    siswaId: spks.siswaId,
                                    semesterAjaranId: selectedSemesterAjaranId,
                                  }),
                                ),
                            }}
                          />
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}
