const baseUrl = '/admin'

function dashboard() {
  return `${baseUrl}`
}

function masterTahunAjaran() {
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

const masterAccountUrl = '/master-account'

function masterAccount() {
  return `${baseUrl}${masterAccountUrl}`
}

function masterAccountCreate() {
  return `${baseUrl}${masterAccountUrl}/create`
}

function masterAccountDetail({ id }: { id: string }) {
  return `${baseUrl}${masterAccountUrl}/detail/${id}`
}

function reporting() {
  return `${baseUrl}/reporting`
}

const admin = {
  dashboard,
  masterTahunAjaran,
  masterKelas,
  masterMataPelajaran,
  masterEkstrakulikuler,
  masterJadwalPelajaran,
  masterPengumuman,
  masterAccount,
  masterAccountCreate,
  masterAccountDetail,
  reporting,
}

export default admin
