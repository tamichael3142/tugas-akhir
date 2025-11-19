import classNames from 'classnames'
import { ComponentProps, ReactNode, useState } from 'react'

export type TextAreaInputProps = {
  label?: ReactNode
  className?: string
  inputProps?: ComponentProps<'textarea'>
}

export default function TextAreaInput(props: TextAreaInputProps) {
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
        })}
      >
        <textarea
          className={classNames('outline-0 grow', className)}
          onFocus={e => {
            setIsFocused(true)
            if (onFocus) onFocus(e)
          }}
          onBlur={e => {
            setIsFocused(false)
            if (onBlur) onBlur(e)
          }}
          rows={restInputProps.rows ?? 4}
          {...restInputProps}
        />
      </div>
    </div>
  )
}
