import AppNav from '~/navigation'
import { SidebarItemProps } from '../types'

import { MdDashboard, MdSportsSoccer, MdChecklistRtl, MdFactCheck } from 'react-icons/md'
import { GrAnnounce } from 'react-icons/gr'
import { PiStudentFill } from 'react-icons/pi'
import { FaUser } from 'react-icons/fa'

export const siswaNavs: SidebarItemProps[] = [
  { icon: <MdDashboard />, label: 'Dashboard', href: AppNav.siswa.dashboard() },
  { icon: <PiStudentFill />, label: 'Kelas', href: AppNav.siswa.kelas() },
  { icon: <MdSportsSoccer />, label: 'Ekstrakulikuler', href: AppNav.siswa.ekstrakulikuler() },
  { icon: <MdChecklistRtl />, label: 'Absensi', href: AppNav.siswa.absensi() },
  { icon: <MdFactCheck />, label: 'Nilai', href: AppNav.siswa.nilai() },
  { icon: <GrAnnounce />, label: 'Pengumuman', href: AppNav.siswa.pengumuman() },
  { icon: <FaUser />, label: 'Account', href: AppNav.siswa.account() },
]
