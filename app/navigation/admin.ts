const baseUrl = '/admin'

/*
 * Admin's lower level routes
 */
function dashboard() {
  return `${baseUrl}`
}

/*
 * Admin's master tahun ajaran level routes
 */
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

/*
 * Admin's master kelas level routes
 */
const masterKelasUrl = '/master-kelas'

function masterKelas() {
  return `${baseUrl}${masterKelasUrl}`
}

function masterKelasCreate() {
  return `${baseUrl}${masterKelasUrl}/create`
}

function masterKelasDetail({ id }: { id: string }) {
  return `${baseUrl}${masterKelasUrl}/${id}/detail`
}

function masterKelasEdit({ id }: { id: string }) {
  return `${baseUrl}${masterKelasUrl}/${id}/edit`
}

/*
 * Admin's master mata pelajaran level routes
 */
const masterMataPelajaranUrl = '/master-mata-pelajaran'

function masterMataPelajaran() {
  return `${baseUrl}${masterMataPelajaranUrl}`
}

function masterMataPelajaranCreate() {
  return `${baseUrl}${masterMataPelajaranUrl}/create`
}

function masterMataPelajaranDetail({ id }: { id: string }) {
  return `${baseUrl}${masterMataPelajaranUrl}/${id}/detail`
}

function masterMataPelajaranEdit({ id }: { id: string }) {
  return `${baseUrl}${masterMataPelajaranUrl}/${id}/edit`
}

/*
 * Admin's master ekstrakulikuler level routes
 */
function masterEkstrakulikuler() {
  return `${baseUrl}/master-ekstrakulikuler`
}

/*
 * Admin's master jadwal pelajaran level routes
 */
function masterJadwalPelajaran() {
  return `${baseUrl}/master-jadwal-pelajaran`
}

/*
 * Admin's master pengumuman level routes
 */
function masterPengumuman() {
  return `${baseUrl}/master-pengumuman`
}

/*
 * Admin's master account level routes
 */
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

/*
 * Admin's reporting level routes
 */
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
  masterKelasCreate,
  masterKelasDetail,
  masterKelasEdit,
  masterMataPelajaran,
  masterMataPelajaranCreate,
  masterMataPelajaranDetail,
  masterMataPelajaranEdit,
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
