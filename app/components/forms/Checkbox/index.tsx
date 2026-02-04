import classNames from 'classnames'
import { ComponentProps, ReactNode } from 'react'

export type CheckboxProps = {
  label?: ReactNode
  className?: string
  labelPosition?: 'left' | 'right'
  inputProps?: ComponentProps<'input'>
}

export default function Checkbox(props: CheckboxProps) {
  const { inputProps = {}, labelPosition = 'right' } = props
  const { className, id = new Date().toString() + props.label, ...restInputProps } = inputProps

  return (
    <div
      className={classNames(
        'flex items-center gap-2',
        {
          ['flex-row justify-start']: labelPosition === 'left',
          ['flex-row-reverse justify-end']: labelPosition === 'right',
        },
        props.className,
      )}
    >
      {props.label ? (
        typeof props.label === 'string' ? (
          <label htmlFor={id} className='text-sm cursor-pointer'>
            {props.label}
          </label>
        ) : (
          props.label
        )
      ) : null}
      <input id={id} type='checkbox' className={classNames('w-4 h-4 cursor-pointer', className)} {...restInputProps} />
    </div>
  )
}
