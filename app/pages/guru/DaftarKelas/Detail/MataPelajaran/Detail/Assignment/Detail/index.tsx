import { useLoaderData, useRevalidator } from '@remix-run/react'
import { Fragment } from 'react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import SiswaKelasDetailMataPelajaranDetailTab, { TabKey } from '../../_components/Tab'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail } from '~/types/loaders-data/guru'
import GuruDaftarKelasDetailMataPelajaranDetailAssignmentDetailDetailComponent from './detail-component'
import SubmissionCard from './_components/SubmissionCard'
import SubmissionCardPlaceholder from './_components/SubmissionCardPlaceholder'

const sectionPrefix = 'guru-daftar-kelas-detail-mata-pelajaran-detail-assignment-detail'

export default function GuruDaftarKelasDetailMataPelajaranDetailAssignmentDetailPage() {
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail>()
  const revalidator = useRevalidator()

  const submitedSiswaIds = loader.assignmentSubmissions.map(item => item.siswaId)
  const filteredSiswaPerKelasPerSemesters = loader.siswaPerKelasPerSemesters.filter(
    item => !submitedSiswaIds.includes(item.siswaId),
  )

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Fragment key={sectionPrefix}>
      <Card className='!p-0 mt-4 lg:mt-8'>
        <SiswaKelasDetailMataPelajaranDetailTab
          kelas={loader.kelas}
          mataPelajaran={loader.mataPelajaran}
          activeTabKey={TabKey.ASSIGNMENT}
        />

        <div className='p-4 lg:px-8'>
          <div className='flex flex-row items-center gap-4'>
            <h2 className='font-semibold text-xl'>Detail Tugas</h2>
            <div className='grow' />
            <BackButton buttonProps={{ size: 'sm', variant: 'outlined', color: 'primary' }} />
          </div>
          <hr className='my-4' />
          <GuruDaftarKelasDetailMataPelajaranDetailAssignmentDetailDetailComponent assignment={loader.assignment} />
        </div>
      </Card>

      <Card className='!p-0 mt-4 lg:mt-8'>
        <div className='p-4 lg:px-8'>
          <div className='flex flex-row items-center gap-4'>
            <h2 className='font-semibold text-xl'>Submissions</h2>
            <div className='grow' />
            <div className='font-semibold'>{`${loader.assignmentSubmissions.length} / ${loader.siswaPerKelasPerSemesters.length}`}</div>
          </div>
          <hr className='my-4' />

          <div className='grid grid-cols-3 gap-4'>
            {loader.assignmentSubmissions.map(submission => (
              <SubmissionCard
                key={`${sectionPrefix}-${submission.id}-submission-card`}
                assignment={loader.assignment}
                submission={submission}
              />
            ))}
            {filteredSiswaPerKelasPerSemesters.map(item => (
              <SubmissionCardPlaceholder
                key={`${sectionPrefix}-${item.id}-submission-card-placeholder`}
                siswaPerKelasPerSemester={item}
              />
            ))}
          </div>
        </div>
      </Card>
    </Fragment>
  )
}
