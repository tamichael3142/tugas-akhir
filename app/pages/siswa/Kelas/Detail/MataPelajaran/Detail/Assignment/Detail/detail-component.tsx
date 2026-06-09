import { Assignment, AssignmentSubmission, Kompetensi, Penilaian } from '@prisma/client'
import classNames from 'classnames'
import { format } from 'date-fns'
import { ReactNode } from 'react'
import constants from '~/constants'
import { AssignmentSubmissionStatus } from '~/database/enums/prisma.enums'
import DBHelpers from '~/database/helpers'
import EnumsTitleUtils from '~/utils/enums-title.utils'

type Props = {
  assignment: Assignment & { connectedKompetensi: Kompetensi | null }
  assignmentSubmission?: AssignmentSubmission | null
  penilaian?: (Penilaian & { nilai: number }) | null
}

export default function SiswaKelasDetailMataPelajaranDetailAssignmentDetailDetailComponent(props: Props) {
  function DetailItem({ label, colSpan = 1, children }: { label?: ReactNode; colSpan?: number; children?: ReactNode }) {
    return (
      <div
        className={classNames('col-span-3 h-full', {
          ['lg:col-span-1']: colSpan === 1,
          ['lg:col-span-2']: colSpan === 2,
          ['lg:col-span-3']: colSpan === 3,
        })}
      >
        <div className='text-sm font-semibold'>{label}</div>
        <div className='border-b py-2 px-1'>{children}</div>
      </div>
    )
  }

  const nilaiValue = props.penilaian?.nilai != null ? Number(props.penilaian.nilai) : null

  return (
    <div className='grid grid-cols-3 gap-4 lg:gap-8'>
      <DetailItem label='Title' colSpan={2}>
        {props.assignment.title}
      </DetailItem>
      <DetailItem label='Status' colSpan={1}>
        {EnumsTitleUtils.getAssignmentSubmissionStatus(
          (props.assignmentSubmission?.submissionStatus ??
            AssignmentSubmissionStatus.ASSIGNED) as AssignmentSubmissionStatus,
        )}
      </DetailItem>
      <DetailItem label='Start Date'>
        {format(new Date(props.assignment.tanggalMulai), constants.dateFormats.rawDateTimeInput)}
      </DetailItem>
      <DetailItem label='End Date'>
        {format(new Date(props.assignment.tanggalBerakhir), constants.dateFormats.rawDateTimeInput)}
      </DetailItem>
      <DetailItem label='Submission'>
        {DBHelpers.mapelAssignment.getIsSubmittable(props.assignment) ? (
          <span className='text-secondary'>{'Open'}</span>
        ) : (
          <span className='text-primary'>{'Closed'}</span>
        )}
      </DetailItem>
      <DetailItem label='Description' colSpan={3}>
        {props.assignment.description ?? '-'}
      </DetailItem>
      {props.assignment.connectedKompetensi ? (
        <DetailItem label={`Score — ${props.assignment.connectedKompetensi.label}`} colSpan={3}>
          {nilaiValue != null ? (
            <span className='font-semibold text-lg text-primary'>{nilaiValue}</span>
          ) : (
            <span className='text-gray-400'>Not yet scored</span>
          )}
        </DetailItem>
      ) : null}
    </div>
  )
}
