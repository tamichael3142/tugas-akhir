import AppNav from '~/navigation'
import { SidebarItemProps } from '../types'

import { MdDashboard, MdSchedule, MdSportsSoccer } from 'react-icons/md'
import { GrAnnounce } from 'react-icons/gr'
import { FaPeopleRoof } from 'react-icons/fa6'
import { FaUser } from 'react-icons/fa'

export const guruNavs: SidebarItemProps[] = [
  { icon: <MdDashboard />, label: 'Dashboard', href: AppNav.guru.dashboard() },
  { icon: <MdSchedule />, label: 'Lesson Timetable', href: AppNav.guru.jadwalMengajar({}) },
  { icon: <FaPeopleRoof />, label: 'Class List', href: AppNav.guru.daftarKelas() },
  { icon: <MdSportsSoccer />, label: 'Manage Extracurricular', href: AppNav.guru.manageEkstrakulikuler() },
  { icon: <GrAnnounce />, label: 'Master Announcement', href: AppNav.guru.masterPengumuman() },
  { icon: <FaUser />, label: 'My Account', href: AppNav.guru.account() },
]
