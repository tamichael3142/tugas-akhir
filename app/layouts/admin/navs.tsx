import AppNav from '~/navigation'
import { SidebarItemProps } from '../types'

import { MdDashboard, MdOutlineAccountCircle, MdSportsSoccer } from 'react-icons/md'
import { FaCalendarAlt } from 'react-icons/fa'
import { FaPeopleRoof } from 'react-icons/fa6'
import { IoBookSharp } from 'react-icons/io5'
import { AiFillSchedule } from 'react-icons/ai'
import { GrAnnounce } from 'react-icons/gr'
import { HiDocumentReport } from 'react-icons/hi'

export const adminNavs: SidebarItemProps[] = [
  { icon: <MdDashboard />, label: 'Dashboard', href: AppNav.admin.dashboard() },
  {
    icon: <FaCalendarAlt />,
    label: 'Master Tahun Ajaran',
    href: AppNav.admin.masterTahunAjaran(),
  },
  { icon: <FaPeopleRoof />, label: 'Master Kelas', href: AppNav.admin.masterKelas() },
  { icon: <IoBookSharp />, label: 'Master Mata Pelajaran', href: AppNav.admin.masterMataPelajaran() },
  { icon: <MdSportsSoccer />, label: 'Master Ekstrakulikuler', href: AppNav.admin.masterEkstrakulikuler() },
  { icon: <AiFillSchedule />, label: 'Master Jadwal Pelajaran', href: AppNav.admin.masterJadwalPelajaran() },
  { icon: <GrAnnounce />, label: 'Master Pengumuman', href: AppNav.admin.masterPengumuman() },
  { icon: <MdOutlineAccountCircle />, label: 'Master Account', href: AppNav.admin.masterAccount() },
  { icon: <HiDocumentReport />, label: 'Reporting', href: AppNav.admin.reporting() },
]
