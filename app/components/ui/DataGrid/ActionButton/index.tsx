import classNames from 'classnames'
import { ComponentProps, ReactNode } from 'react'
import { Tooltip } from '../../Tooltip'

export type DataGridActionButtonProps = {
  label?: ReactNode
  className?: string
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default'
  icon?: ReactNode
  buttonProps?: ComponentProps<'button'>
}

export default function DataGridActionButton(props: DataGridActionButtonProps) {
  const { color = 'default', buttonProps = {} } = props
  const { className, ...restButtonProps } = buttonProps

  function renderComponent() {
    return (
      <button
        type='button'
        className={classNames(
          'flex flex-row items-center justify-center gap-2 rounded-lg cursor-pointer px-2 py-1 duration-200',
          'disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-300 disabled:hover:bg-white',
          {
            ['border border-neutral-400 text-neutral-400 hover:bg-neutral-400/10']: color === 'default',
            ['border border-primary text-primary hover:bg-primary/10']: color === 'primary',
            ['border border-secondary text-secondary hover:bg-secondary/10']: color === 'secondary',
            ['border border-red-600 text-red-600 hover:bg-red-600/10']: color === 'error',
            ['border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10']: color === 'warning',
            ['border border-green-700 text-green-700 hover:bg-green-700/10']: color === 'success',
            ['border border-blue-400 text-blue-400 hover:bg-blue-400/10']: color === 'info',
          },
          props.className,
          className,
        )}
        {...restButtonProps}
      >
        {props.icon}
      </button>
    )
  }

  if (props.label)
    return (
      <Tooltip label={props.label} placement='bottom'>
        {renderComponent()}
      </Tooltip>
    )

  return renderComponent()
}
