import { Controller } from 'react-hook-form'
import { AdminMasterAccountInsertAkunFormType } from './form-types'
import { useRemixFormContext } from 'remix-hook-form'
import { StaticSelect, TextInput } from '~/components/forms'
import { ReactNode } from 'react'
import { GolonganDarah, JenisKelamin, Kewarganegaraan, Role } from '~/database/enums/prisma.enums'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import DBHelpers from '~/database/helpers'
import { Akun } from '@prisma/client'

type Props = {
  dontTriggerSetNewUsername?: boolean
}

export default function AdminMasterAccountFormComponent(props: Props) {
  const { dontTriggerSetNewUsername } = props
  const formHook = useRemixFormContext<AdminMasterAccountInsertAkunFormType>()

  function setNewUsername() {
    const data = formHook.getValues() as Akun
    const newUsername = DBHelpers.akun.generateUsername(data)
    formHook.setValue('username', newUsername, { shouldValidate: true })
  }

  function InputWrapper({ children }: { children?: ReactNode }) {
    return <div className='col-span-2 md:col-span-1'>{children}</div>
  }

  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-2'>
      <div className='col-span-2'>
        <Controller
          control={formHook.control}
          name={'nip'}
          render={({ field }) => <TextInput label='NIP' inputProps={{ ...field }} />}
        />
      </div>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'username'}
          render={({ field }) => (
            <TextInput
              label='Username'
              inputProps={{
                ...field,
                readOnly: true,
                placeholder: 'Masukkan Nama Depan, Nama Belakang, dan Tanggal Lahir...',
              }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'role'}
          render={({ field }) => (
            <StaticSelect
              label='Role'
              options={Object.values(Role).map(opt => ({ value: opt, label: EnumsTitleUtils.getRole(opt) }))}
              selectProps={{ ...field }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'firstName'}
          render={({ field }) => (
            <TextInput
              label='First Name'
              inputProps={{
                ...field,
                onChange: e => {
                  field.onChange(e)
                  if (!dontTriggerSetNewUsername) setNewUsername()
                },
              }}
            />
          )}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'lastName'}
          render={({ field }) => (
            <TextInput
              label='Last Name'
              inputProps={{
                ...field,
                onChange: e => {
                  field.onChange(e)
                  if (!dontTriggerSetNewUsername) setNewUsername()
                },
              }}
            />
          )}
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
          name={'tanggalLahir'}
          render={({ field }) => (
            <TextInput
              label='Tanggal Lahir'
              inputProps={{
                type: 'date',
                ...field,
                value: field.value ?? '',
                onChange: e => {
                  field.onChange(e)
                  if (!dontTriggerSetNewUsername) setNewUsername()
                },
              }}
            />
          )}
        />
      </InputWrapper>
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
          name={'jenisKelamin'}
          render={({ field }) => (
            <StaticSelect
              label='Jenis Kelamin'
              options={Object.values(JenisKelamin).map(opt => ({
                value: opt,
                label: EnumsTitleUtils.getJenisKelamin(opt),
              }))}
              selectProps={{ ...field }}
            />
          )}
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
