import classNames from 'classnames'
import { ComponentProps } from 'react'

export type RadioProps = {
  className?: string
  label?: string
  labelPlacement?: 'top' | 'bottom' | 'left' | 'right'
  inputProps?: ComponentProps<'input'>
}

export default function Radio(props: RadioProps) {
  const { inputProps = {}, labelPlacement = 'right' } = props
  const { className, ...restInputProps } = inputProps

  return (
    <div
      className={classNames(
        'flex gap-2',
        {
          ['flex-row items-center']: labelPlacement === 'left',
          ['flex-row-reverse justify-end items-center']: labelPlacement === 'right',
          ['flex-col']: labelPlacement === 'top',
          ['flex-col-reverse']: labelPlacement === 'bottom',
        },
        props.className,
      )}
    >
      <label htmlFor={restInputProps.id} className='cursor-pointer'>
        {props.label}
      </label>
      <input {...restInputProps} type='radio' className={classNames('cursor-pointer', className)} />
    </div>
  )
}
