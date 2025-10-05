import classNames from 'classnames'
import { ComponentProps, ReactNode } from 'react'

export type ButtonProps = {
  label?: ReactNode
  className?: string
  color?: 'primary' | 'secondary'
  variant?: 'outlined' | 'contained' | 'text'
  size?: 'sm' | 'md' | 'lg'
  startIcon?: ReactNode
  endIcon?: ReactNode
  buttonProps?: ComponentProps<'button'>
  onlyIconOnSmallView?: boolean
}

export default function Button(props: ButtonProps) {
  const { variant = 'contained', color = 'primary', size = 'md', buttonProps = {} } = props
  const { className, ...restButtonProps } = buttonProps

  return (
    <button
      type='button'
      className={classNames(
        'flex flex-row items-center justify-center gap-2 rounded-lg cursor-pointer',
        'disabled:cursor-not-allowed',
        {
          ['px-4 py-2 duration-200']: size === 'md',
          ['bg-primary text-white hover:opacity-80']: color === 'primary' && variant === 'contained',
          ['bg-secondary text-white hover:opacity-80']: color === 'secondary' && variant === 'contained',
          ['disabled:bg-gray-400 disabled:opacity-80']: variant === 'contained',
          ['border-1 border-primary text-primary hover:bg-primary/10']: color === 'primary' && variant === 'outlined',
          ['border-1 border-secondary text-secondary hover:bg-secondary/10']:
            color === 'secondary' && variant === 'outlined',
          ['disabled:border-gray-400 disabled:opacity-80']: variant === 'outlined',
          ['text-primary hover:bg-primary/10']: color === 'primary' && variant === 'text',
          ['text-secondary hover:bg-secondary/10']: color === 'secondary' && variant === 'text',
          ['disabled:bg-gray-400']: variant === 'text',
        },
        props.className,
        className,
      )}
      {...restButtonProps}
    >
      {props.startIcon}
      <span className={classNames({ ['hidden md:block']: props.onlyIconOnSmallView })}>{props.label}</span>
      {props.endIcon}
    </button>
  )
}
