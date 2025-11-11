import { Controller } from 'react-hook-form'
import { AdminMasterEkstrakulikulerCreateFormType } from './form-types'
import { useRemixFormContext } from 'remix-hook-form'
import { StaticSelect, TextInput } from '~/components/forms'
import { ReactNode } from 'react'
import { Akun, TahunAjaran } from '@prisma/client'
import DBHelpers from '~/database/helpers'

type Props = {
  tahunAjarans: TahunAjaran[]
  pengajars: Akun[]
}

export default function AdminMasterEkstrakulikulerFormComponent(props: Props) {
  const formHook = useRemixFormContext<AdminMasterEkstrakulikulerCreateFormType>()

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
              label='Tahun Ajaran'
              options={[
                { value: '', label: 'Pilih tahun ajaran...' },
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
          name={'pengajarId'}
          render={({ field }) => (
            <StaticSelect
              label='Pengajar'
              options={[
                { value: '', label: 'Pilih guru pengajar...' },
                ...props.pengajars.map(item => ({ value: item.id, label: DBHelpers.akun.getDisplayName(item) })),
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
          render={({ field }) => <TextInput label='Nama' inputProps={{ ...field }} />}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'ruangan'}
          render={({ field }) => <TextInput label='Ruangan' inputProps={{ ...field }} />}
        />
      </InputWrapper>
    </div>
  )
}
