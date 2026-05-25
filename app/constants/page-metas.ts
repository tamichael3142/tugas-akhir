import pages from './pages'
import sbbs from './sbbs'

const pageMetas = {
  default: [
    { title: `${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: sbbs.siteDescription },
  ],
  adminDefault: [
    { title: `Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterTahunAjaran: [
    { title: `Master Academic Year - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterKelas: [
    { title: `Master Class - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterKelasManageSiswa: [
    { title: `Manage Siswa - Master Class - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterKelasAddSiswa: [
    { title: `Add Student - Master Class - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterMataPelajaran: [
    { title: `Master Subject - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterEkstrakulikuler: [
    { title: `Master Extracurricular - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterPengumuman: [
    { title: `Master Announcement - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterAccount: [
    { title: `Master Account - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterAccountManageChildren: [
    { title: `Manage Children - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminAccount: [
    { title: `Account - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  authLogin: [
    { title: `Login | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Log in to SBBS' },
  ],
  authForgotPassword: [
    { title: `Forgot Password | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Forgot password on SBBS' },
  ],
  guruDefault: [
    { title: `Teacher | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruDaftarKelas: [
    { title: `Classes - Teacher | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruJadwalMengajar: [
    { title: `Lesson Timetable - Teacher | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruManageMataPelajaran: [
    { title: `Manage Subject - Teacher | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruManageBeritaAcara: [
    { title: `Manage Daily Report - Teacher | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruManageAssignment: [
    { title: `Manage Assignment - Teacher | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruManageAttachment: [
    { title: `Manage Attachment - Teacher | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruManagePenilaian: [
    { title: `Manage Assessment - Teacher | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruManagePelanggaran: [
    { title: `Manage Violation - Teacher | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruMasterPengumuman: [
    { title: `Master Announcement - Teacher | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruManageAbsensi: [
    { title: `Manage Abnsence - Teacher | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruAccount: [
    { title: `Account - Teacher | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  siswaDashboard: [
    { title: `Dashboard - Student | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaKelas: [
    { title: `Class - Student | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaMapelAssignment: [
    { title: `Assignment - Student | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaMapelAttachment: [
    { title: `Attachment - Student | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaMapelPenilaian: [
    { title: `Assessment - Student | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaMapelPelanggaran: [
    { title: `Violation - Student | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaNilai: [
    { title: `Score - Student | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaAbsensi: [
    { title: `Absence - Student | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaPelanggaran: [
    { title: `Violation - Student | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaPengumuman: [
    { title: `Announcement - Student | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaAccount: [
    { title: `Account - Student | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  ortuDashboard: [
    { title: `Dashboard - Parent | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Site for parent on SBBS' },
  ],
  ortuNilai: [
    { title: `Student Score - Parent | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Site for parent on SBBS' },
  ],
  ortuAbsensi: [
    { title: `Student Absence - Parent | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Site for parent on SBBS' },
  ],
  ortuPengumuman: [
    { title: `Announcement - Parent | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Site for parent on SBBS' },
  ],
  ortuAccount: [
    { title: `Account - Parent | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Site for parent on SBBS' },
  ],
}

export default pageMetas
