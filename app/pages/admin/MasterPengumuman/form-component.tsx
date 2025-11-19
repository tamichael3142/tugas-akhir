import { Controller } from 'react-hook-form'
import { AdminMasterPengumumanCreateFormType } from './form-types'
import { useRemixFormContext } from 'remix-hook-form'
import { TextAreaInput, TextInput } from '~/components/forms'
import { ReactNode } from 'react'

export default function AdminMasterPengumumanFormComponent() {
  const formHook = useRemixFormContext<AdminMasterPengumumanCreateFormType>()

  function InputWrapper({ children }: { children?: ReactNode }) {
    return <div className='col-span-2'>{children}</div>
  }

  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-2'>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'nama'}
          render={({ field }) => <TextInput label='Nama' inputProps={{ ...field }} />}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'content'}
          render={({ field }) => <TextAreaInput label='Content' inputProps={{ ...field }} />}
        />
      </InputWrapper>
    </div>
  )
}
