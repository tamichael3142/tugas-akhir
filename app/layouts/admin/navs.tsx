import AppNav from '~/navigation'
import { SidebarItemProps } from '../types'

import { MdDashboard, MdOutlineAccountCircle, MdSportsSoccer } from 'react-icons/md'
import { FaCalendarAlt, FaFileExcel, FaUser } from 'react-icons/fa'
import { FaPeopleRoof } from 'react-icons/fa6'
import { IoBookSharp } from 'react-icons/io5'
import { GrAnnounce } from 'react-icons/gr'
// import { HiDocumentReport } from 'react-icons/hi'

export const adminNavs: SidebarItemProps[] = [
  { icon: <MdDashboard />, label: 'Dashboard', href: AppNav.admin.dashboard() },
  {
    icon: <FaCalendarAlt />,
    label: 'Master Academic Year',
    href: AppNav.admin.masterTahunAjaran(),
  },
  { icon: <FaPeopleRoof />, label: 'Master Class', href: AppNav.admin.masterKelas() },
  { icon: <IoBookSharp />, label: 'Master Subject', href: AppNav.admin.masterMataPelajaran() },
  { icon: <MdSportsSoccer />, label: 'Master Extracurricular', href: AppNav.admin.masterEkstrakulikuler() },
  { icon: <GrAnnounce />, label: 'Master Announcement', href: AppNav.admin.masterPengumuman() },
  { icon: <FaFileExcel />, label: 'Import Excel Templates', href: AppNav.admin.importExcelTemplate() },
  { icon: <MdOutlineAccountCircle />, label: 'Master Account', href: AppNav.admin.masterAccount() },
  // { icon: <HiDocumentReport />, label: 'Reporting', href: AppNav.admin.reporting() },
  { icon: <FaUser />, label: 'My Account', href: AppNav.admin.account() },
]
