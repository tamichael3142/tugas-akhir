import { Controller } from 'react-hook-form'
import { AdminMasterTahunAjaranCreateFormType } from './form-types'
import { useRemixFormContext } from 'remix-hook-form'
import { TextInput } from '~/components/forms'

export default function AdminMasterTahunAjaranFormComponent() {
  const formHook = useRemixFormContext<AdminMasterTahunAjaranCreateFormType>()

  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-2'>
      <div className='col-span-2'>
        <Controller
          control={formHook.control}
          name={'nama'}
          render={({ field }) => <TextInput label='Nama' inputProps={{ ...field }} />}
        />
      </div>
    </div>
  )
}
