import classNames from 'classnames'
import { ReactNode } from 'react'

export type TabItem = {
  key: string
  label?: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

export type TabsProps = {
  activeItemKey?: TabItem['key']
  onTabClick?: (tabKey: TabItem['key']) => void
  items?: TabItem[]
}

export default function Tabs(props: TabsProps) {
  const { items = [] } = props

  if (items.length <= 0) return null
  else
    return (
      <div className='w-full max-w-full overflow-x-auto overflow-y-hidden flex flex-row border-b rounded-t-2xl bg-neutral-100'>
        {items.map(item => {
          const isActive = props.activeItemKey === item.key

          return (
            <button
              key={item.key}
              type='button'
              className={classNames('py-2 px-4 cursor-pointer font-semibold select-none duration-100', {
                ['bg-primary hover:bg-primary/90 text-white']: isActive,
                ['hover:bg-primary/90 hover:text-white']: !isActive && !item.disabled,
                ['!cursor-not-allowed']: item.disabled,
              })}
              onClick={() => props.onTabClick?.(item.key)}
              disabled={item.disabled}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    )
}
