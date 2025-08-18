const baseUrl = '/admin'

function dashboard() {
  return `${baseUrl}`
}

function masterTahunAjaranDanSemester() {
  return `${baseUrl}/master-tahun-ajaran`
}

function masterKelas() {
  return `${baseUrl}/master-kelas`
}

function masterMataPelajaran() {
  return `${baseUrl}/master-mata-pelajaran`
}

function masterEkstrakulikuler() {
  return `${baseUrl}/master-ekstrakulikuler`
}

function masterJadwalPelajaran() {
  return `${baseUrl}/master-jadwal-pelajaran`
}

function masterPengumuman() {
  return `${baseUrl}/master-pengumuman`
}

function masterAccount() {
  return `${baseUrl}/master-account`
}

function reporting() {
  return `${baseUrl}/reporting`
}

const admin = {
  dashboard,
  masterTahunAjaranDanSemester,
  masterKelas,
  masterMataPelajaran,
  masterEkstrakulikuler,
  masterJadwalPelajaran,
  masterPengumuman,
  masterAccount,
  reporting,
}

export default admin
