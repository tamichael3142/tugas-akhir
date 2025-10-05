import { Form, useActionData, useNavigate } from '@remix-run/react'
import { ReactNode, useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { useRemixForm } from 'remix-hook-form'
import { Button, StaticSelect, TextInput } from '~/components/forms'
import { BackButton, Card } from '~/components/ui'
import { GolonganDarah, JenisKelamin, Kewarganegaraan, Role } from '~/database/enums/prisma.enums'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { AdminMasterAccountInsertAkunFormType, resolver, defaultValues } from './form'
import { Controller } from 'react-hook-form'
import { Akun } from '@prisma/client'
import DBHelpers from '~/database/helpers'
import { ActionDataAdminMasterAccountCreate } from '~/types/actions-data/admin'
import toast from 'react-hot-toast'

const sectionPrefix = 'admin-master-account-create'

export default function AdminMasterAccountCreatePage() {
  const actionData = useActionData<ActionDataAdminMasterAccountCreate>()
  const navigate = useNavigate()

  const formHook = useRemixForm<AdminMasterAccountInsertAkunFormType>({
    defaultValues,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    formHook.reset()
  }

  useEffect(() => {
    if (actionData?.success) {
      resetForm()
      toast.success(actionData.message ?? '')
      navigate(AppNav.admin.masterAccount())
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  function setNewUsername() {
    const data = formHook.getValues() as Akun
    const newUsername = DBHelpers.akun.generateUsername(data)
    formHook.setValue('username', newUsername, { shouldValidate: true })
  }

  function InputWrapper({ children }: { children?: ReactNode }) {
    return <div className='col-span-2 md:col-span-1'>{children}</div>
  }

  return (
    <AdminPageContainer
      title='Create Account'
      actions={[<BackButton key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterAccount()} />]}
    >
      <Form method='post' onSubmit={formHook.handleSubmit}>
        <Card className=''>
          <p className='font-semibold text-lg'>Tambah Akun</p>
          <hr className='my-4' />

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
                        setNewUsername()
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
                        setNewUsername()
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
                        setNewUsername()
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
          <hr className='my-8' />
          <div className='flex flex-row items-center justify-end gap-4'>
            <Button variant='text' color='secondary' label='Kosongkan form' buttonProps={{ onClick: resetForm }} />
            <Button
              variant='contained'
              color='primary'
              startIcon={<FaSave />}
              label='Simpan'
              buttonProps={{ type: 'submit' }}
            />
          </div>
        </Card>
      </Form>
    </AdminPageContainer>
  )
}
