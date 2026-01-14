import AppNav from '~/navigation'
import { SidebarItemProps } from '../types'

import { MdDashboard } from 'react-icons/md'

export const guruNavs: SidebarItemProps[] = [
  { icon: <MdDashboard />, label: 'Dashboard', href: AppNav.guru.dashboard() },
]
