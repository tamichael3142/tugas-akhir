import { Controller } from 'react-hook-form'
import { AdminMasterKelasCreateFormType } from './form-types'
import { useRemixFormContext } from 'remix-hook-form'
import { StaticSelect, TextInput } from '~/components/forms'
import { ReactNode } from 'react'
import { Akun, TahunAjaran } from '@prisma/client'
import DBHelpers from '~/database/helpers'

type Props = {
  tahunAjarans: TahunAjaran[]
  gurus: Akun[]
}

export default function AdminMasterKelasFormComponent(props: Props) {
  const formHook = useRemixFormContext<AdminMasterKelasCreateFormType>()

  function InputWrapper({ children }: { children?: ReactNode }) {
    return <div className='col-span-2 md:col-span-1'>{children}</div>
  }

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
              selectProps={{ ...field }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'waliId'}
          render={({ field }) => (
            <StaticSelect
              label='Homeroom Teacher'
              options={[
                { value: '', label: 'Choose a homeroom teacher...' },
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
    </div>
  )
}
