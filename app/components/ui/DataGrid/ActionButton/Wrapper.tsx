import classNames from 'classnames'
import { ReactNode } from 'react'

type DataGridActionButtonWrapperProps = {
  children?: ReactNode
  className?: string
}

export default function DataGridActionButtonWrapper(props: DataGridActionButtonWrapperProps) {
  return <div className={classNames('flex flex-row items-center gap-2', props.className)}>{props.children}</div>
}
