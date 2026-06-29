import { Assignment } from '@prisma/client'
import classNames from 'classnames'
import { format } from 'date-fns'
import { ReactNode } from 'react'
import constants from '~/constants'
import { AssignmentSubmissionAllowedFileType, AssignmentSubmissionType } from '~/database/enums/prisma.enums'
import DBHelpers from '~/database/helpers'
import EnumsTitleUtils from '~/utils/enums-title.utils'

type Props = {
  assignment: Assignment
}

export default function GuruDaftarKelasDetailMataPelajaranDetailAssignmentDetailDetailComponent(props: Props) {
  const getSubmissionTypeName = () => {
    let result = EnumsTitleUtils.getAssignmentSubmissionType(
      props.assignment.submissionType as AssignmentSubmissionType,
    )
    if (
      props.assignment.submissionType === AssignmentSubmissionType.FILE_UPLOAD &&
      !!props.assignment.submissionAllowedFileType
    )
      result += ` (${EnumsTitleUtils.getAssignmentSubmissionAllowedFileType(props.assignment.submissionAllowedFileType as AssignmentSubmissionAllowedFileType)})`
    return result
  }

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
      <DetailItem label='Title' colSpan={2}>
        {props.assignment.title}
      </DetailItem>
      <DetailItem label='Type' colSpan={1}>
        {getSubmissionTypeName()}
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
        {props.assignment.description}
      </DetailItem>
    </div>
  )
}
