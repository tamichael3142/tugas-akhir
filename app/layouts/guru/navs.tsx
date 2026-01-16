import AppNav from '~/navigation'
import { SidebarItemProps } from '../types'

import { MdDashboard, MdOutlineEmojiPeople, MdSchedule, MdSportsSoccer } from 'react-icons/md'
import { PiStudent } from 'react-icons/pi'
import { IoBookSharp } from 'react-icons/io5'
import { GrAnnounce } from 'react-icons/gr'
import { FaBook } from 'react-icons/fa'

export const guruNavs: SidebarItemProps[] = [
  { icon: <MdDashboard />, label: 'Dashboard', href: AppNav.guru.dashboard() },
  { icon: <MdSchedule />, label: 'Jadwal Mengajar', href: AppNav.guru.jadwalMengajar() },
  { icon: <PiStudent />, label: 'Absensi Siswa', href: AppNav.guru.absensiSiswa() },
  { icon: <IoBookSharp />, label: 'Manage Mata Pelajaran', href: AppNav.guru.manageMataPelajaran() },
  { icon: <MdSportsSoccer />, label: 'Manage Ekstrakulikuler', href: AppNav.guru.manageEkstrakulikuler() },
  { icon: <FaBook />, label: 'Manage Berita Acara', href: AppNav.guru.manageBeritaAcara() },
  { icon: <GrAnnounce />, label: 'Master Pengumuman', href: AppNav.guru.masterPengumuman() },
  { icon: <MdOutlineEmojiPeople />, label: 'Manage Absensi', href: AppNav.guru.manageAbsensi() },
]
