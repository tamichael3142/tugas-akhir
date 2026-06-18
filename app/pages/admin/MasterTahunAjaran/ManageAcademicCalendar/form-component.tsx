import { Controller } from 'react-hook-form'
import { useRemixFormContext } from 'remix-hook-form'
import { TextAreaInput, TextInput } from '~/components/forms'
import { AcademicCalendarEventFormType } from './Create/form'

type DateBounds = {
  min: string // "YYYY-MM-DD"
  max: string // "YYYY-MM-DD"
}

type Props = {
  dateBounds?: DateBounds
}

export default function AcademicCalendarEventFormComponent({ dateBounds }: Props) {
  const formHook = useRemixFormContext<AcademicCalendarEventFormType>()

  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-2'>
      <div className='col-span-2'>
        <Controller
          control={formHook.control}
          name='title'
          render={({ field, fieldState }) => (
            <TextInput
              label='Title'
              inputProps={{ ...field, placeholder: 'e.g. School Holiday' }}
              isError={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </div>
      <div className='col-span-2'>
        <Controller
          control={formHook.control}
          name='description'
          render={({ field }) => (
            <TextAreaInput
              label='Description'
              inputProps={{ ...field, value: field.value ?? '', placeholder: 'Optional description...' }}
            />
          )}
        />
      </div>
      <div className='col-span-1'>
        <Controller
          control={formHook.control}
          name='startDate'
          render={({ field, fieldState }) => (
            <TextInput
              label='Start Date'
              inputProps={{
                ...field,
                type: 'date',
                min: dateBounds?.min,
                max: dateBounds?.max,
                onChange: e => {
                  const currentEndDate = formHook.getValues('endDate')
                  if (e.target.value > currentEndDate) {
                    formHook.setValue('endDate', e.target.value, { shouldValidate: true })
                  }
                  field.onChange(e)
                },
              }}
              isError={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </div>
      <div className='col-span-1'>
        <Controller
          control={formHook.control}
          name='endDate'
          render={({ field, fieldState }) => (
            <TextInput
              label='End Date'
              inputProps={{
                ...field,
                type: 'date',
                min: dateBounds?.min,
                max: dateBounds?.max,
              }}
              isError={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </div>
    </div>
  )
}
