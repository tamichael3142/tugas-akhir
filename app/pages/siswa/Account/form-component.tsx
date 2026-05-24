import { Button } from '~/components/forms'
import { useRef } from 'react'
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
            label='Upload New Image'
            size='sm'
            color='secondary'
            variant='outlined'
            buttonProps={{ onClick: () => importExcelInputRef.current?.click() }}
          />
        </div>
        <div>
          <Button
            label='Change Password'
            size='sm'
            variant='outlined'
            color='secondary'
            buttonProps={{ onClick: () => navigate(AppNav.siswa.accountChangePassword()) }}
          />
        </div>
        <div>
          <Button
            label='Violation'
            size='sm'
            color='primary'
            variant='outlined'
            buttonProps={{ onClick: () => navigate(AppNav.siswa.accountPelanggaran()) }}
          />
        </div>
      </div>

      <div className='col-span-2 mt-4'>
        <div className='p-4 rounded-lg border border-secondary bg-secondary/10 text-secondary font-semibold'>
          *To do update on your current info, please do contact admins!
        </div>
      </div>

      {/* <InputWrapper>
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
          render={({ field }) => <TextInput label='Birth Place' inputProps={{ ...field }} />}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'alamat'}
          render={({ field }) => <TextInput label='Address' inputProps={{ ...field }} />}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'agama'}
          render={({ field }) => <TextInput label='Religion' inputProps={{ ...field }} />}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'golonganDarah'}
          render={({ field }) => (
            <StaticSelect
              label='Blood Type'
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
              label='Nationality'
              options={Object.values(Kewarganegaraan).map(opt => ({
                value: opt,
                label: EnumsTitleUtils.getKewarganegaraan(opt),
              }))}
              selectProps={{ ...field }}
            />
          )}
        />
      </InputWrapper> */}
    </div>
  )
}
