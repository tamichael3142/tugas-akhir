import { Controller } from 'react-hook-form'
import { AdminMasterTahunAjaranCreateFormType } from './form-types'
import { useRemixFormContext } from 'remix-hook-form'
import { Checkbox, TextInput } from '~/components/forms'
import { addYears, format } from 'date-fns'
import constants from '~/constants'
import { useEffect, useState } from 'react'

const MIN_YEAR = 1950
const MAX_YEAR = Number(new Date().getFullYear()) + 20

export default function AdminMasterTahunAjaranFormComponent() {
  const formHook = useRemixFormContext<AdminMasterTahunAjaranCreateFormType>()
  const [autoGenerate, setAutoGenerate] = useState<boolean>(false)

  useEffect(() => {
    const thisYear = new Date(formHook.getValues('tahunMulai'))
    let nextYear = new Date(formHook.getValues('tahunBerakhir'))
    if (nextYear.getFullYear() <= thisYear.getFullYear()) {
      nextYear = addYears(nextYear, 1)
      formHook.setValue('tahunBerakhir', format(nextYear, constants.dateFormats.rawDateInput))
    }
    if (autoGenerate) {
      formHook.setValue('nama', `${thisYear.getFullYear()}/${nextYear.getFullYear()}`)
      formHook.trigger('nama')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formHook.watch('tahunMulai'), formHook.watch('tahunBerakhir')])

  function calculateYearValue(newValue: string) {
    return format(
      new Date(`${Number(newValue) < MIN_YEAR ? MIN_YEAR : Number(newValue) > MAX_YEAR ? MAX_YEAR : newValue}/01/01`),
      constants.dateFormats.rawDateInput,
    )
  }

  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-2'>
      <div className='col-span-1'>
        <Controller
          control={formHook.control}
          name={'tahunMulai'}
          render={({ field }) => (
            <TextInput
              label='Tahun Mulai'
              inputProps={{
                ...field,
                type: 'number',
                min: MIN_YEAR,
                max: MAX_YEAR,
                value: format(field.value, constants.dateFormats.yearFull),
                onChange: e => field.onChange(calculateYearValue(e.target.value)),
              }}
            />
          )}
        />
      </div>
      <div className='col-span-1'>
        <Controller
          control={formHook.control}
          name={'tahunBerakhir'}
          render={({ field }) => (
            <TextInput
              label='Tahun Berakhir'
              inputProps={{
                ...field,
                type: 'number',
                min: MIN_YEAR,
                max: MAX_YEAR,
                value: format(field.value, constants.dateFormats.yearFull),
                onChange: e => field.onChange(calculateYearValue(e.target.value)),
              }}
            />
          )}
        />
      </div>
      <div className='col-span-2'>
        <Controller
          control={formHook.control}
          name={'nama'}
          render={({ field }) => (
            <div>
              <TextInput label='Label' inputProps={{ ...field }} />
              <Checkbox
                label='Auto-Generate'
                className='mt-1'
                inputProps={{ checked: autoGenerate, onChange: e => setAutoGenerate(e.target.checked) }}
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
