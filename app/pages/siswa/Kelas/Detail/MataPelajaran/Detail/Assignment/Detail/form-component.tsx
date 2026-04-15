import { Button, TextAreaInput, TextInput } from '~/components/forms'
import { ReactNode } from 'react'
import classNames from 'classnames'
import { Assignment, AssignmentSubmission } from '@prisma/client'
import { AssignmentSubmissionType } from '~/database/enums/prisma.enums'

type Props = {
  assignment: Assignment
  assignmentSubmission?: AssignmentSubmission | null
}

export default function SiswaKelasDetailMataPelajaranDetailAssignmentDetailFormComponent(props: Props) {
  function InputWrapper({ children, cutting = 'full' }: { children?: ReactNode; cutting?: 'full' | 'half' }) {
    return (
      <div
        className={classNames({
          ['col-span-2']: cutting === 'full',
          ['col-span-1']: cutting === 'half',
        })}
      >
        {children}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-2'>
      {props.assignmentSubmission ? <input type='hidden' name='id' value={props.assignmentSubmission.id} /> : null}
      {props.assignment.submissionType === AssignmentSubmissionType.LONG_TEXT ? (
        <InputWrapper>
          <TextAreaInput
            label='Answer'
            inputProps={{ name: 'answer', defaultValue: props.assignmentSubmission?.answer ?? '' }}
          />
        </InputWrapper>
      ) : props.assignment.submissionType === AssignmentSubmissionType.FILE_UPLOAD ? (
        <InputWrapper>
          <TextInput label='File' inputProps={{ type: 'file', name: 'file' }} />
          {props.assignmentSubmission?.fileDownloadUrl ? (
            <a target='_blank' rel='noreferrer' href={props.assignmentSubmission.fileDownloadUrl}>
              <Button label='Preview' size='sm' color='secondary' className='mt-2 ml-auto' />
            </a>
          ) : null}
        </InputWrapper>
      ) : null}
      <InputWrapper>
        <TextAreaInput
          label='Remarks'
          inputProps={{ name: 'remarksSiswa', defaultValue: props.assignmentSubmission?.remarksSiswa ?? '' }}
        />
      </InputWrapper>
    </div>
  )
}
