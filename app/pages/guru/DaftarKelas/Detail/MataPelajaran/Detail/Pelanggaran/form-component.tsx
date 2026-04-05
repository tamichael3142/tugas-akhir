import { Controller } from 'react-hook-form'
import { GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateFormType } from './form-types'
import { useRemixFormContext } from 'remix-hook-form'
import { StaticSelect, TextAreaInput, TextInput } from '~/components/forms'
import { ReactNode } from 'react'
import classNames from 'classnames'
import { Akun } from '@prisma/client'
import DBHelpers from '~/database/helpers'

type Props = {
  siswas: Akun[]
}

export default function AdminDaftarKelasDetailMataPelajaranDetailPelanggaranFormComponent(props: Props) {
  const formHook = useRemixFormContext<GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateFormType>()

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
      <InputWrapper cutting='half'>
        <Controller
          control={formHook.control}
          name={'siswaId'}
          render={({ field }) => (
            <StaticSelect
              label='Siswa'
              options={[
                { value: '', label: 'Pilih siswa...' },
                ...props.siswas.map(item => ({ value: item.id, label: DBHelpers.akun.getDisplayName(item) })),
              ]}
              selectProps={{ ...field }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper cutting='half'>
        <Controller
          control={formHook.control}
          name={'poin'}
          render={({ field }) => <TextInput label='Poin Pengurangan' inputProps={{ ...field, type: 'number' }} />}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'remark'}
          render={({ field }) => (
            <TextAreaInput label='Keterangan ' inputProps={{ ...field, value: field.value ?? '' }} />
          )}
        />
      </InputWrapper>
    </div>
  )
}
