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
    { title: `Master Tahun Ajaran - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterKelas: [
    { title: `Master Kelas - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterKelasManageSiswa: [
    { title: `Manage Siswa - Master Kelas - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterKelasAddSiswa: [
    { title: `Tambah Siswa - Master Kelas - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterMataPelajaran: [
    { title: `Master Mata Pelajaran - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterEkstrakulikuler: [
    { title: `Master Ekstrakulikuler - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterPengumuman: [
    { title: `Master Pengumuman - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
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
  authLogin: [
    { title: `Login | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Masuk ke SBBS' },
  ],
  authForgotPassword: [
    { title: `Lupa Password | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Lupa password di SBBS' },
  ],
  guruDefault: [
    { title: `Guru | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruDaftarKelas: [
    { title: `Daftar Kelas - Guru | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruJadwalMengajar: [
    { title: `Jadwal Mengajar - Guru | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruManageMataPelajaran: [
    { title: `Manage Mata Pelajaran - Guru | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruManageBeritaAcara: [
    { title: `Manage Berita Acara - Guru | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruManageAssignment: [
    { title: `Manage Tugas - Guru | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruManageAttachment: [
    { title: `Manage Lampiran - Guru | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruManagePenilaian: [
    { title: `Manage Penilaian - Guru | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruManagePelanggaran: [
    { title: `Manage Pelanggaran - Guru | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruMasterPengumuman: [
    { title: `Master Pengumuman - Guru | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  guruManageAbsensi: [
    { title: `Manage Absensi - Guru | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs guru SBBS' },
  ],
  siswaDashboard: [
    { title: `Dashboard - Siswa | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaKelas: [
    { title: `Kelas - Siswa | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaMapelAssignment: [
    { title: `Assignment - Siswa | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaMapelAttachment: [
    { title: `Attachment - Siswa | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaMapelPenilaian: [
    { title: `Penilaian - Siswa | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaMapelPelanggaran: [
    { title: `Pelanggaran - Siswa | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaPelanggaran: [
    { title: `Pelanggaran - Siswa | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  siswaAccount: [
    { title: `Akun - Siswa | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs siswa SBBS' },
  ],
  ortuDashboard: [
    { title: `Dashboard - Ortu | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs orang tua SBBS' },
  ],
}

export default pageMetas
