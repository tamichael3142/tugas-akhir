import { Assignment, Ekstrakulikuler, Kelas, MataPelajaran, MataPelajaranAttachment, Pengumuman } from '@prisma/client'

const baseUrl = '/siswa'

/*
 * Siswa's lower level routes
 */
function dashboard() {
  return `${baseUrl}`
}

/*
 * Siswa's kelas level routes
 */
const kelasUrl = '/kelas'

function kelas() {
  return `${baseUrl}${kelasUrl}`
}

function kelasDetail({ kelasId }: { kelasId: Kelas['id'] }) {
  return `${baseUrl}${kelasUrl}/${kelasId}/detail`
}

function kelasDetailDaftarSiswa({ kelasId }: { kelasId: Kelas['id'] }) {
  return `${baseUrl}${kelasUrl}/${kelasId}/detail/daftar-siswa`
}

function kelasDetailMataPelajaran({ kelasId }: { kelasId: Kelas['id'] }) {
  return `${baseUrl}${kelasUrl}/${kelasId}/detail/mata-pelajaran`
}

/*
 * Siswa's kelas > mata pelajaran detail level routes
 */
const kelasMapelUrl = '/mapel'
function kelasDetailMataPelajaranDetailAssignment({
  kelasId,
  mataPelajaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
}) {
  return `${baseUrl}${kelasUrl}/${kelasId}/detail${kelasMapelUrl}/${mataPelajaranId}/assignment`
}

function kelasDetailMataPelajaranDetailAssignmentDetail({
  kelasId,
  mataPelajaranId,
  assignmentId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
  assignmentId: Assignment['id']
}) {
  return `${baseUrl}${kelasUrl}/${kelasId}/detail${kelasMapelUrl}/${mataPelajaranId}/assignment-detail/${assignmentId}`
}

function kelasDetailMataPelajaranDetailAttachment({
  kelasId,
  mataPelajaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
}) {
  return `${baseUrl}${kelasUrl}/${kelasId}/detail${kelasMapelUrl}/${mataPelajaranId}/attachment`
}

function kelasDetailMataPelajaranDetailAttachmentDetail({
  kelasId,
  mataPelajaranId,
  attachmentId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
  attachmentId: MataPelajaranAttachment['id']
}) {
  return `${baseUrl}${kelasUrl}/${kelasId}/detail${kelasMapelUrl}/${mataPelajaranId}/attachment-detail/${attachmentId}`
}

function kelasDetailMataPelajaranDetailPenilaian({
  kelasId,
  mataPelajaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
}) {
  return `${baseUrl}${kelasUrl}/${kelasId}/detail${kelasMapelUrl}/${mataPelajaranId}/penilaian`
}

function kelasDetailMataPelajaranDetailPenilaianDetail({
  kelasId,
  mataPelajaranId,
  attachmentId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
  attachmentId: MataPelajaranAttachment['id']
}) {
  return `${baseUrl}${kelasUrl}/${kelasId}/detail${kelasMapelUrl}/${mataPelajaranId}/penilaian-detail/${attachmentId}`
}

function kelasDetailMataPelajaranDetailPelanggaran({
  kelasId,
  mataPelajaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
}) {
  return `${baseUrl}${kelasUrl}/${kelasId}/detail${kelasMapelUrl}/${mataPelajaranId}/pelanggaran`
}

function kelasDetailMataPelajaranDetailPelanggaranDetail({
  kelasId,
  mataPelajaranId,
  attachmentId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
  attachmentId: MataPelajaranAttachment['id']
}) {
  return `${baseUrl}${kelasUrl}/${kelasId}/detail${kelasMapelUrl}/${mataPelajaranId}/pelanggaran-detail/${attachmentId}`
}

/*
 * Siswa's ekstrakulikuler level routes
 */
const ekstrakulikulerUrl = '/ekstrakulikuler'

function ekstrakulikuler() {
  return `${baseUrl}${ekstrakulikulerUrl}`
}

function ekstrakulikulerDetail({ ekstrakulikulerId }: { ekstrakulikulerId: Ekstrakulikuler['id'] }) {
  return `${baseUrl}${ekstrakulikulerUrl}/${ekstrakulikulerId}/detail`
}

/*
 * Siswa's absensi level routes
 */
const absensiUrl = '/absensi'

function absensi() {
  return `${baseUrl}${absensiUrl}`
}

/*
 * Siswa's nilai level routes
 */
const nilaiUrl = '/nilai'

function nilai() {
  return `${baseUrl}${nilaiUrl}`
}

/*
 * Siswa's pengumuman level routes
 */
const pengumumanUrl = '/pengumuman'

function pengumuman() {
  return `${baseUrl}${pengumumanUrl}`
}

function pengumumanDetail({ pengumumanId }: { pengumumanId: Pengumuman['id'] }) {
  return `${baseUrl}${pengumumanUrl}/${pengumumanId}/detail`
}

/*
 * Siswa's account level routes
 */
const accountUrl = '/account'

function account() {
  return `${baseUrl}${accountUrl}`
}

function accountChangePassword() {
  return `${baseUrl}${accountUrl}/change-password`
}

function accountPelanggaran() {
  return `${baseUrl}${accountUrl}/pelanggaran`
}

const siswa = {
  baseUrl,
  dashboard,
  kelas,
  kelasDetail,
  kelasDetailDaftarSiswa,
  kelasDetailMataPelajaran,
  kelasDetailMataPelajaranDetailAssignment,
  kelasDetailMataPelajaranDetailAssignmentDetail,
  kelasDetailMataPelajaranDetailAttachment,
  kelasDetailMataPelajaranDetailAttachmentDetail,
  kelasDetailMataPelajaranDetailPenilaian,
  kelasDetailMataPelajaranDetailPenilaianDetail,
  kelasDetailMataPelajaranDetailPelanggaran,
  kelasDetailMataPelajaranDetailPelanggaranDetail,
  ekstrakulikuler,
  ekstrakulikulerDetail,
  absensi,
  nilai,
  pengumuman,
  pengumumanDetail,
  account,
  accountChangePassword,
  accountPelanggaran,
}

export default siswa
