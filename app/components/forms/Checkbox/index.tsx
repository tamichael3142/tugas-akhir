import classNames from 'classnames'
import { ComponentProps, ReactNode } from 'react'

export type CheckboxProps = {
  label?: ReactNode
  className?: string
  inputProps?: ComponentProps<'input'>
}

export default function Checkbox(props: CheckboxProps) {
  const { inputProps = {} } = props
  const { className, ...restInputProps } = inputProps

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
      <input type='checkbox' className={classNames('w-4 h-4 cursor-pointer', className)} {...restInputProps} />
    </div>
  )
}
