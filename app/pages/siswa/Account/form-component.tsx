import { Controller } from 'react-hook-form'
import { useRemixFormContext } from 'remix-hook-form'
import { Button, StaticSelect, TextInput } from '~/components/forms'
import { ReactNode } from 'react'
import { GolonganDarah, Kewarganegaraan } from '~/database/enums/prisma.enums'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { SiswaAccountSelfUpdateFormType } from './form'
import { Akun } from '@prisma/client'

type Props = {
  account: Akun & { profileImageObjectUrl?: string }
}

export default function SiswaAccountSelfUpdateFormComponent(props: Props) {
  const formHook = useRemixFormContext<SiswaAccountSelfUpdateFormType>()

  function InputWrapper({ children }: { children?: ReactNode }) {
    return <div className='col-span-2 md:col-span-1'>{children}</div>
  }

  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-2'>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'email'}
          render={({ field }) => <TextInput label='Email' inputProps={{ ...field }} />}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'tempatLahir'}
          render={({ field }) => <TextInput label='Tempat Lahir' inputProps={{ ...field }} />}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'alamat'}
          render={({ field }) => <TextInput label='Alamat' inputProps={{ ...field }} />}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'agama'}
          render={({ field }) => <TextInput label='Agama' inputProps={{ ...field }} />}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'golonganDarah'}
          render={({ field }) => (
            <StaticSelect
              label='Golongan Darah'
              options={Object.values(GolonganDarah).map(opt => ({
                value: opt,
                label: EnumsTitleUtils.getGolonganDarah(opt),
              }))}
              selectProps={{ ...field }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'kewarganegaraan'}
          render={({ field }) => (
            <StaticSelect
              label='Kewarganegaraan'
              options={Object.values(Kewarganegaraan).map(opt => ({
                value: opt,
                label: EnumsTitleUtils.getKewarganegaraan(opt),
              }))}
              selectProps={{ ...field }}
            />
          )}
        />
      </InputWrapper>

      <div className='flex flex-row flex-wrap gap-4 mt-4'>
        <div>
          <img src={props.account.profileImageObjectUrl} alt='' />
        </div>
        <Button label='Ubah Password' size='sm' />
      </div>
    </div>
  )
}
