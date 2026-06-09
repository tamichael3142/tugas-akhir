import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { useFetcher } from '@remix-run/react'
import toast from 'react-hot-toast'
import constants from '~/constants'
import { AssignmentSubmissionStatus, AssignmentSubmissionType } from '~/database/enums/prisma.enums'
import DBHelpers from '~/database/helpers'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail } from '~/types/loaders-data/guru'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentScoreSubmission } from '~/types/actions-data/guru'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { Button } from '~/components/forms'
import { FaSave } from 'react-icons/fa'

type Props = {
  assignment: LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail['assignment']
  submission: LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail['assignmentSubmissions'][0]
  existingNilai?: number | null
}

export default function SubmissionCard(props: Props) {
  const { assignment, submission, existingNilai } = props
  const fetcher = useFetcher<ActionDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentScoreSubmission>({
    key: `submission-score-${submission.id}`,
  })
  const [nilaiInput, setNilaiInput] = useState<string>(existingNilai != null ? String(Number(existingNilai)) : '')
  const isConnected = !!assignment.connectedKompetensiId
  const prevFetcherData = useRef(fetcher.data)

  useEffect(() => {
    if (fetcher.data === prevFetcherData.current) return
    prevFetcherData.current = fetcher.data
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message ?? 'Assessment saved!')
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.message ?? 'Failed to save assessment.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data])

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
        ) : assignment.submissionType === AssignmentSubmissionType.LONG_TEXT ? (
          <div className='text-sm mt-2 rounded-lg bg-neutral-200 p-2'>
            <p className='font-semibold'>Answer:</p>
            <p className='text-justify'>{submission.answer}</p>
          </div>
        ) : null}
        {submission.remarksSiswa ? (
          <div className='text-sm mt-2 rounded-lg bg-neutral-200 p-2'>
            <p className='font-semibold'>Remarks:</p>
            <p className='text-justify'>{submission.remarksSiswa}</p>
          </div>
        ) : null}
      </div>

      {isConnected ? (
        <div className='mt-4 border-t pt-4'>
          <p className='text-xs text-gray-500 mb-1'>
            Assessment <span className='font-semibold'>{assignment.connectedKompetensi?.label}</span>
          </p>
          <fetcher.Form method='post' className='flex flex-row items-center gap-2'>
            <input type='hidden' name='submissionId' value={submission.id} />
            <input
              type='phone'
              name='nilai'
              min={0}
              max={100}
              value={nilaiInput}
              onChange={e => {
                let value = e.target.value
                value = value.replace(/\D/g, '')
                value = value.replace(/^0+(?=\d)/, '')
                if (value === '') {
                  setNilaiInput('')
                  return
                }
                let num = Number(value)
                if (num > 100) num = 100
                if (num < 0) num = 0
                setNilaiInput(String(num))
              }}
              className='border-2 border-gray-300 rounded-lg px-3 py-1.5 text-sm w-24 outline-0 focus:border-primary'
            />
            <Button
              variant='contained'
              color='primary'
              size='sm'
              startIcon={<FaSave />}
              label='Save'
              buttonProps={{ type: 'submit', disabled: fetcher.state === 'submitting' }}
            />
          </fetcher.Form>
        </div>
      ) : null}
    </div>
  )
}
