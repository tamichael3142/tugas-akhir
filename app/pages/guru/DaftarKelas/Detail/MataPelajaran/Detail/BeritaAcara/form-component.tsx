import { Controller } from 'react-hook-form'
import { GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraCreateFormType } from './form-types'
import { useRemixFormContext } from 'remix-hook-form'
import { StaticSelect, TextAreaInput, TextInput } from '~/components/forms'
import { ReactNode, useEffect } from 'react'
import classNames from 'classnames'
import { Days, Hour, Kelas, MataPelajaran, MataPelajaranBeritaAcara } from '@prisma/client'
import { generateTitle } from './Create/form'

type Props = {
  days: Days[]
  hours: Hour[]
  kelas: Kelas
  mapel: MataPelajaran
  beritaAcara?: MataPelajaranBeritaAcara & { day: Days; hourStart: Hour; hourEnd: Hour }
}

export default function AdminDaftarKelasDetailMataPelajaranDetailBeritaAcaraFormComponent(props: Props) {
  const mode = props.beritaAcara ? 'edit' : 'create'
  const formHook = useRemixFormContext<GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraCreateFormType>()

  useEffect(() => {
    if (mode === 'create') {
      formHook.setValue(
        'title',
        generateTitle({
          date: new Date(),
          kelasName: props.kelas.nama,
          mapelName: props.mapel.nama,
        }),
      )
      const dayIndex = new Date().getDay() - 1
      const currentDay = props.days[dayIndex]
      if (currentDay) {
        formHook.setValue('dayId', currentDay.id)
        formHook.trigger('dayId')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, props])

  function InputWrapper({
    children,
    cutting = 'full',
  }: {
    children?: ReactNode
    cutting?: 'full' | 'one-third' | 'two-third'
  }) {
    return (
      <div
        className={classNames({
          ['col-span-3']: cutting === 'full',
          ['col-span-2']: cutting === 'two-third',
          ['col-span-1']: cutting === 'one-third',
        })}
      >
        {children}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-3 gap-x-8 gap-y-2'>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'title'}
          render={({ field }) => <TextInput label='Judul' inputProps={{ ...field }} />}
        />
      </InputWrapper>
      <InputWrapper cutting='one-third'>
        <Controller
          control={formHook.control}
          name={'dayId'}
          render={({ field }) => (
            <StaticSelect
              label='Hari'
              options={props.days.map(item => ({
                label: item.label,
                value: item.id,
              }))}
              selectProps={{ ...field }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper cutting='one-third'>
        <Controller
          control={formHook.control}
          name={'hourStartId'}
          render={({ field }) => (
            <StaticSelect
              label='Jam Mulai'
              options={props.hours.map(item => ({
                label: item.label.split('-')[0],
                value: item.id,
              }))}
              selectProps={{ ...field }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper cutting='one-third'>
        <Controller
          control={formHook.control}
          name={'hourEndId'}
          render={({ field }) => (
            <StaticSelect
              label='Jam Berakhir'
              options={props.hours.map(item => ({
                label: item.label.split('-')[1],
                value: item.id,
              }))}
              selectProps={{ ...field }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'remark'}
          render={({ field }) => <TextAreaInput label='Remark' inputProps={{ ...field }} />}
        />
      </InputWrapper>
    </div>
  )
}
