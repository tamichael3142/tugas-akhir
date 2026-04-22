import classNames from 'classnames'
import { ComponentProps, ReactNode, useState } from 'react'

export type TextInputProps = {
  label?: ReactNode
  className?: string
  inputProps?: ComponentProps<'input'>
  endIcon?: ReactNode
  isError?: boolean
  helperText?: string
}

export default function TextInput(props: TextInputProps) {
  const { inputProps = {} } = props
  const { className, onFocus, onBlur, ...restInputProps } = inputProps

  const [isFocused, setIsFocused] = useState<boolean>(false)

  return (
    <div className={classNames('', props.className)}>
      {props.label ? (
        typeof props.label === 'string' ? (
          <label htmlFor={props.inputProps?.id} className='text-sm'>
            {props.label}
          </label>
        ) : (
          props.label
        )
      ) : null}
      <div
        className={classNames('border-2 border-gray-300 rounded-lg px-4 py-2 flex flex-row items-center', {
          ['mt-1']: typeof props.label === 'string',
          ['border-primary']: isFocused,
          ['bg-gray-300 text-gray-600 cursor-not-allowed']: inputProps.disabled,
        })}
      >
        <input
          type='text'
          className={classNames('outline-0 grow', { ['cursor-not-allowed']: inputProps.disabled }, className)}
          onFocus={e => {
            setIsFocused(true)
            if (onFocus) onFocus(e)
          }}
          onBlur={e => {
            setIsFocused(false)
            if (onBlur) onBlur(e)
          }}
          {...restInputProps}
        />
        {props.endIcon}
      </div>
      {props.helperText ? (
        <p
          className={classNames('text-xs', {
            ['text-neutral-500']: !props.isError,
            ['text-red-500']: props.isError,
          })}
        >
          {props.helperText}
        </p>
      ) : null}
    </div>
  )
}
