import AppNav from '~/navigation'
import { SidebarItemProps } from '../types'

import { MdDashboard, MdSchedule, MdSportsSoccer } from 'react-icons/md'
import { GrAnnounce } from 'react-icons/gr'
import { FaPeopleRoof } from 'react-icons/fa6'
import { FaUser } from 'react-icons/fa'

export const guruNavs: SidebarItemProps[] = [
  { icon: <MdDashboard />, label: 'Dashboard', href: AppNav.guru.dashboard() },
  { icon: <MdSchedule />, label: 'Jadwal Mengajar', href: AppNav.guru.jadwalMengajar({}) },
  { icon: <FaPeopleRoof />, label: 'Daftar Kelas', href: AppNav.guru.daftarKelas() },
  { icon: <MdSportsSoccer />, label: 'Manage Ekstrakulikuler', href: AppNav.guru.manageEkstrakulikuler() },
  { icon: <GrAnnounce />, label: 'Master Pengumuman', href: AppNav.guru.masterPengumuman() },
  { icon: <FaUser />, label: 'Account', href: AppNav.guru.account() },
]
