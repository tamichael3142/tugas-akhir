import AppNav from '~/navigation'
import { SidebarItemProps } from '../types'

export const adminNavs: SidebarItemProps[] = [
  { label: 'Dashboard', href: AppNav.admin.dashboard() },
  { label: 'Master Tahun Ajaran dan Semester', href: AppNav.admin.masterTahunAjaranDanSemester() },
  { label: 'Master Kelas', href: AppNav.admin.masterKelas() },
  { label: 'Master Mata Pelajaran', href: AppNav.admin.masterMataPelajaran() },
  { label: 'Master Ekstrakulikuler', href: AppNav.admin.masterEkstrakulikuler() },
  { label: 'Master Jadwal Pelajaran', href: AppNav.admin.masterJadwalPelajaran() },
  { label: 'Master Pengumuman', href: AppNav.admin.masterPengumuman() },
  { label: 'Master Account', href: AppNav.admin.masterAccount() },
  { label: 'Reporting', href: AppNav.admin.reporting() },
]
