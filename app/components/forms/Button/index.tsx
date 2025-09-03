import classNames from 'classnames'
import { ComponentProps, ReactNode } from 'react'

export type ButtonProps = {
  label?: string
  className?: string
  color?: 'primary' | 'secondary'
  variant?: 'outline' | 'contained'
  size?: 'sm' | 'md' | 'lg'
  startIcon?: ReactNode
  endIcon?: ReactNode
  buttonProps?: ComponentProps<'button'>
}

export default function Button(props: ButtonProps) {
  const { variant = 'contained', color = 'primary', size = 'md', buttonProps = {} } = props
  const { className, ...restButtonProps } = buttonProps

  return (
    <button
      type='button'
      className={classNames(
        'flex flex-row items-center justify-center gap-2 rounded-lg cursor-pointer',
        {
          ['px-4 py-2']: size === 'md',
          ['bg-primary text-white hover:opacity-80']: color === 'primary' && variant === 'contained',
        },
        props.className,
        className,
      )}
      {...restButtonProps}
    >
      {props.label}
    </button>
  )
}
