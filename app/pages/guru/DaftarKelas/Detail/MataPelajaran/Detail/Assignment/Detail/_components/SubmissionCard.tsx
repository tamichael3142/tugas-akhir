import { format } from 'date-fns'
import constants from '~/constants'
import { AssignmentSubmissionStatus, AssignmentSubmissionType } from '~/database/enums/prisma.enums'
import DBHelpers from '~/database/helpers'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail } from '~/types/loaders-data/guru'
import EnumsTitleUtils from '~/utils/enums-title.utils'

type Props = {
  assignment: LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail['assignment']
  submission: LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail['assignmentSubmissions'][0]
}

export default function SubmissionCard(props: Props) {
  const { assignment, submission } = props

  return (
    <div className='col-span-3 lg:col-span-1 border rounded-lg shadow p-4 hover:shadow-md duration-200 text-left'>
      <div className='flex flex-row items-center gap-4'>
        <div>
          <h1 className='font-semibold'>{DBHelpers.akun.getDisplayName(submission.siswa)}</h1>
          <p className='text-sm text-gray-500'>
            {format(new Date(submission.createdAt), constants.dateFormats.rawDateTimeInput)}
          </p>
        </div>
        <div className='grow'></div>
        <div className='rounded-lg px-1 py-0.5 bg-secondary text-white'>
          <p className='text-sm'>
            {EnumsTitleUtils.getAssignmentSubmissionStatus(submission.submissionStatus as AssignmentSubmissionStatus)}
          </p>
        </div>
      </div>

      <div className='mt-4'>
        {assignment.submissionType === AssignmentSubmissionType.FILE_UPLOAD ? (
          <div className='rounded-lg px-2 py-1 bg-primary hover:bg-primary/80 text-white text-sm cursor-pointer text-center'>
            {submission.fileDownloadUrl ? (
              <a href={submission.fileDownloadUrl} target='_blank' rel='noreferrer' className='w-full block'>
                Submission Preview
              </a>
            ) : (
              <p>No File</p>
            )}
          </div>
        ) : null}
        {submission.remarksSiswa ? (
          <div className='text-sm mt-2 rounded-lg bg-neutral-200 p-2'>
            <p className='font-semibold'>Remarks:</p>
            <p className='text-justify'>{submission.remarksSiswa}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
