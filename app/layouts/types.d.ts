import { ReactNode } from 'react'

export type SidebarItemProps = {
  id?: string
  label?: ReactNode
  icon?: ReactNode
  href?: string
  onClick?: () => void
  children?: SidebarItemProps[]
  active?: boolean
}
