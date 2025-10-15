const baseUrl = '/admin'

function dashboard() {
  return `${baseUrl}`
}

const masterTahunAjaranUrl = '/master-tahun-ajaran'

function masterTahunAjaran() {
  return `${baseUrl}${masterTahunAjaranUrl}`
}

function masterTahunAjaranCreate() {
  return `${baseUrl}${masterTahunAjaranUrl}/create`
}

function masterTahunAjaranDetail({ id }: { id: string }) {
  return `${baseUrl}${masterTahunAjaranUrl}/${id}/detail`
}

function masterTahunAjaranEdit({ id }: { id: string }) {
  return `${baseUrl}${masterTahunAjaranUrl}/${id}/edit`
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
  return `${baseUrl}${masterAccountUrl}/${id}/detail`
}

function masterAccountEdit({ id }: { id: string }) {
  return `${baseUrl}${masterAccountUrl}/${id}/edit`
}

function reporting() {
  return `${baseUrl}/reporting`
}

const admin = {
  dashboard,
  masterTahunAjaran,
  masterTahunAjaranCreate,
  masterTahunAjaranDetail,
  masterTahunAjaranEdit,
  masterKelas,
  masterMataPelajaran,
  masterEkstrakulikuler,
  masterJadwalPelajaran,
  masterPengumuman,
  masterAccount,
  masterAccountCreate,
  masterAccountDetail,
  masterAccountEdit,
  reporting,
}

export default admin
