import { Controller } from 'react-hook-form'
import { useRemixFormContext } from 'remix-hook-form'
import { Button, TextInput } from '~/components/forms'
import { ReactNode, useState } from 'react'
import { LAuthSetInitialPasswordFormType } from './form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function LAuthSetInitialPasswordFormComponent() {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] = useState<boolean>(false)

  const formHook = useRemixFormContext<LAuthSetInitialPasswordFormType>()

  function InputWrapper({ children }: { children?: ReactNode }) {
    return <div className='col-span-2 lg:col-span-1'>{children}</div>
  }

  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-2'>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'password'}
          render={({ field, fieldState }) => (
            <TextInput
              label='New Password'
              inputProps={{
                ...field,
                type: passwordVisible ? 'text' : 'password',
              }}
              isError={!!fieldState.error}
              helperText={fieldState.error?.message}
              endIcon={
                <Button
                  label={passwordVisible ? <FaEye /> : <FaEyeSlash />}
                  size='sm'
                  color='default'
                  buttonProps={{ onClick: () => setPasswordVisible(oldVal => !oldVal) }}
                />
              }
            />
          )}
        />
      </InputWrapper>
      <InputWrapper>
        <Controller
          control={formHook.control}
          name={'passwordVerification'}
          render={({ field, fieldState }) => (
            <TextInput
              label='Password Confirmation'
              inputProps={{ ...field, type: passwordConfirmationVisible ? 'text' : 'password' }}
              isError={!!fieldState.error}
              helperText={fieldState.error?.message}
              endIcon={
                <Button
                  label={passwordConfirmationVisible ? <FaEye /> : <FaEyeSlash />}
                  size='sm'
                  color='default'
                  buttonProps={{ onClick: () => setPasswordConfirmationVisible(oldVal => !oldVal) }}
                />
              }
            />
          )}
        />
      </InputWrapper>
    </div>
  )
}
