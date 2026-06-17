import { Controller } from 'react-hook-form'
import { AdminMasterMataPelajaranCreateFormType } from './form-types'
import { useRemixFormContext } from 'remix-hook-form'
import { StaticSelect, TextInput } from '~/components/forms'
import { ReactNode, useCallback } from 'react'
import { Akun, SemesterAjaran, TahunAjaran } from '@prisma/client'
import DBHelpers from '~/database/helpers'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'

type Props = {
  tahunAjarans: (TahunAjaran & { semesterAjaran: SemesterAjaran[] })[]
  gurus: Akun[]
}

export default function AdminMasterMataPelajaranFormComponent(props: Props) {
  const formHook = useRemixFormContext<AdminMasterMataPelajaranCreateFormType>()
  const selectedTahunAjaran = useCallback(() => {
    const selectedTahunAjaranId = formHook.getValues('tahunAjaranId')
    return props.tahunAjarans.find(item => item.id === selectedTahunAjaranId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formHook.watch('tahunAjaranId')])()

  function InputWrapper({ children }: { children?: ReactNode }) {
    return <div className='col-span-2 md:col-span-1'>{children}</div>
  }

  const getSemesterAjaranOptions = useCallback(() => {
    if (selectedTahunAjaran && selectedTahunAjaran.semesterAjaran) return selectedTahunAjaran.semesterAjaran
    else return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formHook.watch('tahunAjaranId')])

  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-2'>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'tahunAjaranId'}
          render={({ field }) => (
            <StaticSelect
              label='Academic Year'
              options={[
                { value: '', label: 'Choose academic year...' },
                ...props.tahunAjarans.map(item => ({ value: item.id, label: item.nama })),
              ]}
              selectProps={{
                ...field,
                onChange: e => {
                  formHook.setValue('semesterAjaranId', '')
                  formHook.trigger('semesterAjaranId')
                  field.onChange(e)
                },
              }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'semesterAjaranId'}
          render={({ field }) => (
            <StaticSelect
              label='Academic Semester'
              options={[
                { value: '', label: 'Choose academic semester...' },
                ...getSemesterAjaranOptions().map(item => ({
                  value: item.id,
                  label: EnumsTitleUtils.getSemesterAjaranUrutan(item.urutan as SemesterAjaranUrutan),
                })),
              ]}
              selectProps={{ ...field }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'guruId'}
          render={({ field }) => (
            <StaticSelect
              label='Teacher'
              options={[
                { value: '', label: 'Choose a teacher...' },
                ...props.gurus.map(item => ({ value: item.id, label: DBHelpers.akun.getDisplayName(item) })),
              ]}
              selectProps={{ ...field }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'nama'}
          render={({ field }) => <TextInput label='Name' inputProps={{ ...field }} />}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'kkm'}
          render={({ field }) => (
            <TextInput
              label='Minimum Score (KKM)'
              inputProps={{
                ...field,
                type: 'phone',
                onChange: e => {
                  let value = e.target.value
                  value = value.replace(/\D/g, '')
                  value = value.replace(/^0+(?=\d)/, '')
                  if (value === '') {
                    field.onChange('')
                    return
                  }
                  let num = Number(value)
                  if (num > 100) num = 100
                  if (num < 0) num = 0
                  field.onChange(String(num))
                },
              }}
            />
          )}
        />
      </InputWrapper>
    </div>
  )
}
