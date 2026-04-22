import AppNav from '~/navigation'
import { SidebarItemProps } from '../types'

import { MdDashboard, MdChecklistRtl, MdFactCheck } from 'react-icons/md'
import { GrAnnounce } from 'react-icons/gr'
import { FaUser } from 'react-icons/fa'

export const ortuNavs: SidebarItemProps[] = [
  { icon: <MdDashboard />, label: 'Dashboard', href: AppNav.ortu.dashboard() },
  { icon: <MdFactCheck />, label: 'Nilai Siswa', href: AppNav.ortu.nilaiSiswa() },
  { icon: <MdChecklistRtl />, label: 'Absensi Siswa', href: AppNav.ortu.absensiSiswa() },
  { icon: <GrAnnounce />, label: 'Pengumuman', href: AppNav.ortu.pengumuman() },
  { icon: <FaUser />, label: 'Account', href: AppNav.ortu.account() },
]
