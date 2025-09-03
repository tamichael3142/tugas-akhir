import classNames from 'classnames'
import { ReactNode } from 'react'

export type CardProps = {
  id?: string
  className?: string
  children?: ReactNode
}

export default function Card(props: CardProps) {
  return (
    <div id={props.id} className={classNames('shadow-2xl rounded-2xl p-4 md:p-8', props.className)}>
      {props.children}
    </div>
  )
}
