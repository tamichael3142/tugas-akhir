import { Controller } from 'react-hook-form'
import { GuruManageAbsensiEditFormType } from './form-types'
import { useRemixFormContext } from 'remix-hook-form'
import { StaticSelect, TextAreaInput, TextInput } from '~/components/forms'
import { ReactNode } from 'react'
import classNames from 'classnames'
import { LoaderDataGuruManageAbsensiEdit } from '~/types/loaders-data/guru'
import { useLoaderData } from '@remix-run/react'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import { format } from 'date-fns'
import constants from '~/constants'

export default function GuruMasterPengumumanFormComponent() {
  const loader = useLoaderData<LoaderDataGuruManageAbsensiEdit>()
  const formHook = useRemixFormContext<GuruManageAbsensiEditFormType>()

  function InputWrapper({ children, className }: { children?: ReactNode; className?: string }) {
    return <div className={classNames('col-span-2', className)}>{children}</div>
  }

  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-2'>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'label'}
          render={({ field }) => <TextInput label='Label' inputProps={{ ...field }} />}
        />
      </InputWrapper>
      <InputWrapper className='md:col-span-1'>
        <Controller
          control={formHook.control}
          name={'tanggal'}
          render={({ field }) => (
            <TextInput
              label='Tanggal'
              inputProps={{
                type: 'date',
                value: format(field.value, constants.dateFormats.rawDateInput),
                readOnly: true,
                disabled: true,
                // ? Jika ingin bsa di ganti
                // onChange: e => {
                //   const selectedDate = e.target.value ? new Date(e.target.value) : null
                //   if (selectedDate) {
                //     field.onChange(selectedDate)
                //     formHook.setValue('tanggalText', format(selectedDate, constants.dateFormats.displayFullDate))
                //   } else {
                //     field.onChange(null)
                //     formHook.setValue('tanggalText', '')
                //   }
                //   formHook.trigger('tanggal')
                //   formHook.trigger('tanggalText')
                // },
              }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper className='md:col-span-1'>
        <Controller
          control={formHook.control}
          name='kelasId'
          render={({ field }) => (
            <StaticSelect
              label='Kelas'
              options={[
                {
                  label: loader.absensi?.kelas?.nama ?? '',
                  value: loader.absensi?.kelas?.id ?? '',
                },
              ]}
              selectProps={{ value: field.value, disabled: true }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper className='md:col-span-1'>
        <StaticSelect
          label='Tahun Ajaran'
          options={[
            {
              label: loader.absensi?.kelas.tahunAjaran?.nama ?? '',
              value: loader.absensi?.kelas.tahunAjaran?.id ?? '',
            },
          ]}
          selectProps={{ value: loader.absensi?.kelas.tahunAjaran?.id, disabled: true }}
        />
      </InputWrapper>
      <InputWrapper className='md:col-span-1'>
        <Controller
          control={formHook.control}
          name='semesterAjaranId'
          render={({ field }) => (
            <StaticSelect
              label='Semester Ajaran'
              options={loader.absensi?.kelas.tahunAjaran?.semesterAjaran.map(item => ({
                label: EnumsTitleUtils.getSemesterAjaranUrutan(item.urutan as SemesterAjaranUrutan),
                value: item.urutan,
              }))}
              selectProps={{ value: field.value, disabled: true }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'remarks'}
          render={({ field }) => <TextAreaInput label='Remarks' inputProps={{ ...field, value: field.value ?? '' }} />}
        />
      </InputWrapper>
    </div>
  )
}
