const baseUrl = '/guru'

/*
 * Guru's lower level routes
 */
function dashboard() {
  return `${baseUrl}`
}

/*
 * Guru's jadwal mengajar level routes
 */
const jadwalMengajarUrl = '/jadwal-mengajar'

function jadwalMengajar() {
  return `${baseUrl}${jadwalMengajarUrl}`
}

/*
 * Guru's absensi siswa level routes
 */
const absensiSiswaUrl = '/absensi-siswa'

function absensiSiswa() {
  return `${baseUrl}${absensiSiswaUrl}`
}

/*
 * Guru's manage mata pelajaran level routes
 */
const manageMataPelajaranUrl = '/manage-mata-pelajaran'

function manageMataPelajaran() {
  return `${baseUrl}${manageMataPelajaranUrl}`
}

/*
 * Guru's manage ekstrakulikuler level routes
 */
const manageEkstrakulikulerUrl = '/manage-mata-pelajaran'

function manageEkstrakulikuler() {
  return `${baseUrl}${manageEkstrakulikulerUrl}`
}

/*
 * Guru's manage berita acara level routes
 */
const manageBeritaAcaraUrl = '/manage-mata-pelajaran'

function manageBeritaAcara() {
  return `${baseUrl}${manageBeritaAcaraUrl}`
}

/*
 * Guru's master pengumuman level routes
 */
const masterPengumumanUrl = '/master-pengumuman'

function masterPengumuman() {
  return `${baseUrl}${masterPengumumanUrl}`
}

function masterPengumumanCreate() {
  return `${baseUrl}${masterPengumumanUrl}/create`
}

function masterPengumumanDetail({ id }: { id: string }) {
  return `${baseUrl}${masterPengumumanUrl}/${id}/detail`
}

function masterPengumumanEdit({ id }: { id: string }) {
  return `${baseUrl}${masterPengumumanUrl}/${id}/edit`
}

/*
 * Guru's manage absensi level routes
 */
const manageAbsensiUrl = '/manage-absensi'

function manageAbsensi() {
  return `${baseUrl}${manageAbsensiUrl}`
}

const guru = {
  baseUrl,
  dashboard,
  jadwalMengajar,
  absensiSiswa,
  manageMataPelajaran,
  manageEkstrakulikuler,
  manageBeritaAcara,
  masterPengumuman,
  masterPengumumanCreate,
  masterPengumumanDetail,
  masterPengumumanEdit,
  manageAbsensi,
}

export default guru
