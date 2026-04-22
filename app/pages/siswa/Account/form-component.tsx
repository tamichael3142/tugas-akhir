import { Controller } from 'react-hook-form'
import { useRemixFormContext } from 'remix-hook-form'
import { Button, StaticSelect, TextInput } from '~/components/forms'
import { ReactNode, useRef } from 'react'
import { GolonganDarah, Kewarganegaraan } from '~/database/enums/prisma.enums'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { SiswaAccountSelfUpdateFormType } from './form'
import { Akun } from '@prisma/client'
import { Form, useNavigate } from '@remix-run/react'
import AppNav from '~/navigation'

type Props = {
  account: Akun & { profileImageObjectUrl?: string }
}

const importExcelFormId = 'siswa-account-change-profile-image-form'

export default function SiswaAccountSelfUpdateFormComponent(props: Props) {
  const navigate = useNavigate()

  const importExcelFormRef = useRef<HTMLFormElement>(null)
  const importExcelInputRef = useRef<HTMLInputElement>(null)

  const formHook = useRemixFormContext<SiswaAccountSelfUpdateFormType>()

  function InputWrapper({ children }: { children?: ReactNode }) {
    return <div className='col-span-2 md:col-span-1'>{children}</div>
  }

  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-2'>
      <div className='flex flex-row items-center flex-wrap gap-4 col-span-2'>
        <Form
          id={importExcelFormId}
          method='post'
          encType='multipart/form-data'
          action={AppNav.siswaAction.accountUploadProfileImage()}
          ref={importExcelFormRef}
        >
          <input
            type='file'
            name='file'
            hidden
            ref={importExcelInputRef}
            accept='image/*'
            onChange={() => importExcelFormRef.current?.submit()}
          />
        </Form>

        <div>
          {props.account.profileImageObjectUrl ? (
            <img
              src={props.account.profileImageObjectUrl}
              alt={`${props.account.firstName.charAt(0)}${props.account.lastName.charAt(0)}`}
              loading='lazy'
              className='w-12 h-12 rounded-full aspect-square bg-secondary border border-secondary'
            />
          ) : (
            <div className='w-12 h-12 rounded-full aspect-square bg-secondary flex flex-row items-center justify-center text-white'>
              {`${props.account.firstName.charAt(0)}${props.account.lastName.charAt(0)}`}
            </div>
          )}
        </div>
        <div>
          <Button
            key={importExcelFormId}
            label='Ubah Profile Image'
            size='sm'
            color='secondary'
            variant='outlined'
            buttonProps={{ onClick: () => importExcelInputRef.current?.click() }}
          />
        </div>
        <div>
          <Button
            label='Ubah Password'
            size='sm'
            variant='outlined'
            color='secondary'
            buttonProps={{ onClick: () => navigate(AppNav.siswa.accountChangePassword()) }}
          />
        </div>
        <div>
          <Button
            label='Pelanggaran'
            size='sm'
            color='primary'
            variant='outlined'
            buttonProps={{ onClick: () => navigate(AppNav.siswa.accountPelanggaran()) }}
          />
        </div>
      </div>

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
    </div>
  )
}
