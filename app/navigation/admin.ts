import { Kelas, SemesterAjaran } from '@prisma/client'

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

function masterKelasManageJadwal({ id, semesterAjaranId }: { id: string; semesterAjaranId: string }) {
  return `${baseUrl}${masterKelasUrl}/${id}/manage-jadwal/${semesterAjaranId}`
}

function masterKelasManageSiswa({
  id,
  semesterAjaranId,
}: {
  id: Kelas['id']
  semesterAjaranId?: SemesterAjaran['id']
}) {
  const params = new URLSearchParams()
  if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
  return `${baseUrl}${masterKelasUrl}/${id}/manage-siswa${params.size ? `?${params.toString()}` : ''}`
}

function masterKelasAbsence({ id, semesterAjaranId }: { id: Kelas['id']; semesterAjaranId?: SemesterAjaran['id'] }) {
  const params = new URLSearchParams()
  if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
  return `${baseUrl}${masterKelasUrl}/${id}/absence${params.size ? `?${params.toString()}` : ''}`
}

function masterKelasAssessment({ id, semesterAjaranId }: { id: Kelas['id']; semesterAjaranId?: SemesterAjaran['id'] }) {
  const params = new URLSearchParams()
  if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
  return `${baseUrl}${masterKelasUrl}/${id}/penilaian${params.size ? `?${params.toString()}` : ''}`
}

function masterKelasAddSiswa({ id }: { id: string }) {
  return `${baseUrl}${masterKelasUrl}/${id}/add-siswa`
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
const masterEkstrakulikulerUrl = '/master-ekstrakulikuler'

function masterEkstrakulikuler() {
  return `${baseUrl}/master-ekstrakulikuler`
}

function masterEkstrakulikulerCreate() {
  return `${baseUrl}${masterEkstrakulikulerUrl}/create`
}

function masterEkstrakulikulerDetail({ id }: { id: string }) {
  return `${baseUrl}${masterEkstrakulikulerUrl}/${id}/detail`
}

function masterEkstrakulikulerEdit({ id }: { id: string }) {
  return `${baseUrl}${masterEkstrakulikulerUrl}/${id}/edit`
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

function masterAccountManageChildren({ id }: { id: string }) {
  return `${baseUrl}${masterAccountUrl}/${id}/manage-children`
}

/*
 * Admin's reporting level routes
 */
function reporting() {
  return `${baseUrl}/reporting`
}

/*
 * Admin's account level routes
 */
const accountUrl = '/account'
function account() {
  return `${baseUrl}${accountUrl}`
}

function accountChangePassword() {
  return `${baseUrl}${accountUrl}/change-password`
}

const admin = {
  baseUrl,
  dashboard,
  masterTahunAjaran,
  masterTahunAjaranCreate,
  masterTahunAjaranDetail,
  masterTahunAjaranEdit,
  masterKelas,
  masterKelasCreate,
  masterKelasDetail,
  masterKelasEdit,
  masterKelasManageJadwal,
  masterKelasManageSiswa,
  masterKelasAbsence,
  masterKelasAssessment,
  masterKelasAddSiswa,
  masterMataPelajaran,
  masterMataPelajaranCreate,
  masterMataPelajaranDetail,
  masterMataPelajaranEdit,
  masterEkstrakulikuler,
  masterEkstrakulikulerCreate,
  masterEkstrakulikulerDetail,
  masterEkstrakulikulerEdit,
  masterJadwalPelajaran,
  masterPengumuman,
  masterPengumumanCreate,
  masterPengumumanDetail,
  masterPengumumanEdit,
  masterAccount,
  masterAccountCreate,
  masterAccountDetail,
  masterAccountEdit,
  masterAccountManageChildren,
  reporting,
  account,
  accountChangePassword,
}

export default admin
