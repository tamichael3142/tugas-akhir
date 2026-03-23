import { Controller } from 'react-hook-form'
import { GuruManageMataPelajaranDetailAssignmentCreateFormType } from './form-types'
import { useRemixFormContext } from 'remix-hook-form'
import { Checkbox, StaticSelect, TextAreaInput, TextInput } from '~/components/forms'
import { ReactNode } from 'react'
import classNames from 'classnames'
import { format } from 'date-fns'
import constants from '~/constants'
import { AssignmentSubmissionType } from '~/database/enums/prisma.enums'
import EnumsTitleUtils from '~/utils/enums-title.utils'

export default function AdminManageMataPelajaranDetailAssignmentFormComponent() {
  const formHook = useRemixFormContext<GuruManageMataPelajaranDetailAssignmentCreateFormType>()

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
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'title'}
          render={({ field }) => <TextInput label='Title' inputProps={{ ...field }} />}
        />
      </InputWrapper>
      <InputWrapper cutting='half'>
        <Controller
          control={formHook.control}
          name={'tanggalMulai'}
          render={({ field }) => (
            <TextInput
              label='Tanggal Mulai'
              inputProps={{
                type: 'datetime-local',
                value: format(field.value, constants.dateFormats.rawDateTimeInput),
                onChange: e => {
                  const selectedDate = e.target.value ? new Date(e.target.value) : null
                  field.onChange(selectedDate ? format(selectedDate, constants.dateFormats.rawDateTimeInput) : null)
                  formHook.trigger('tanggalMulai')
                },
              }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper cutting='half'>
        <Controller
          control={formHook.control}
          name={'tanggalBerakhir'}
          render={({ field }) => (
            <TextInput
              label='Tanggal Berakhir'
              inputProps={{
                type: 'datetime-local',
                value: format(field.value, constants.dateFormats.rawDateTimeInput),
                onChange: e => {
                  const selectedDate = e.target.value ? new Date(e.target.value) : null
                  field.onChange(selectedDate ? format(selectedDate, constants.dateFormats.rawDateTimeInput) : null)
                  formHook.trigger('tanggalBerakhir')
                },
              }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'description'}
          render={({ field }) => <TextAreaInput label='Description' inputProps={{ ...field }} />}
        />
      </InputWrapper>
      <InputWrapper cutting='half'>
        <Controller
          control={formHook.control}
          name='submissionType'
          render={({ field }) => (
            <StaticSelect
              label='Submission Type'
              options={Object.values(AssignmentSubmissionType).map(item => ({
                label: EnumsTitleUtils.getAssignmentSubmissionType(item),
                value: item,
              }))}
              selectProps={{ value: field.value, onChange: e => field.onChange(e.target.value) }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper cutting='half'>
        <Controller
          control={formHook.control}
          name={'isSubmitable'}
          render={({ field }) => (
            <div className='flex flex-row items-center h-full'>
              <Checkbox
                label='Set submitable'
                inputProps={{
                  id: 'isSubmitable',
                  checked: field.value,
                  onChange: e => field.onChange(e.target.checked),
                }}
              />
            </div>
          )}
        />
      </InputWrapper>
    </div>
  )
}
