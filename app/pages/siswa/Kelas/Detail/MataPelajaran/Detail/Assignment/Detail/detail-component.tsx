import { Assignment, AssignmentSubmission } from '@prisma/client'
import classNames from 'classnames'
import { format } from 'date-fns'
import { ReactNode } from 'react'
import constants from '~/constants'
import { AssignmentSubmissionStatus } from '~/database/enums/prisma.enums'
import DBHelpers from '~/database/helpers'
import EnumsTitleUtils from '~/utils/enums-title.utils'

type Props = {
  assignment: Assignment
  assignmentSubmission?: AssignmentSubmission | null
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

  return (
    <div className='grid grid-cols-3 gap-4 lg:gap-8'>
      <DetailItem label='Judul' colSpan={2}>
        {props.assignment.title}
      </DetailItem>
      <DetailItem label='Status' colSpan={1}>
        {props.assignmentSubmission
          ? EnumsTitleUtils.getAssignmentSubmissionStatus(
              props.assignmentSubmission.submissionStatus as AssignmentSubmissionStatus,
            )
          : ''}
      </DetailItem>
      <DetailItem label='Tanggal Mulai'>
        {format(new Date(props.assignment.tanggalMulai), constants.dateFormats.rawDateTimeInput)}
      </DetailItem>
      <DetailItem label='Tanggal Berakhir'>
        {format(new Date(props.assignment.tanggalBerakhir), constants.dateFormats.rawDateTimeInput)}
      </DetailItem>
      <DetailItem label='Submission'>
        {DBHelpers.mapelAssignment.getIsSubmittable(props.assignment) ? (
          <span className='text-secondary'>{'Terbuka'}</span>
        ) : (
          <span className='text-primary'>{'Sudah ditutup'}</span>
        )}
      </DetailItem>
      <DetailItem label='Deskripsi' colSpan={3}>
        {props.assignment.description}
      </DetailItem>
    </div>
  )
}
