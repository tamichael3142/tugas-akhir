import {
  Absensi,
  Assignment,
  Kelas,
  MataPelajaran,
  MataPelajaranAttachment,
  MataPelajaranBeritaAcara,
  PelanggaranPerMapel,
  SemesterAjaran,
  TahunAjaran,
} from '@prisma/client'

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

function jadwalMengajar({
  tahunAjaranId,
  semesterAjaranId,
  kelasId,
}: {
  tahunAjaranId?: TahunAjaran['id']
  semesterAjaranId?: SemesterAjaran['id']
  kelasId?: Kelas['id']
}) {
  const params = new URLSearchParams()
  if (tahunAjaranId) params.set('tahunAjaranId', tahunAjaranId)
  if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
  if (kelasId) params.set('kelasId', kelasId)
  return `${baseUrl}${jadwalMengajarUrl}?${params.toString()}`
}

/*
 * Guru's daftar kelas level routes
 */
const daftarKelasUrl = '/daftar-kelas'

function daftarKelas() {
  return `${baseUrl}${daftarKelasUrl}`
}

function daftarKelasDetail({ kelasId }: { kelasId: Kelas['id'] }) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/daftar-siswa`
}

function daftarKelasDetailDaftarSiswa({
  kelasId,
  semesterAjaranId,
}: {
  kelasId: Kelas['id']
  semesterAjaranId?: SemesterAjaran['id']
}) {
  const params = new URLSearchParams()
  if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/daftar-siswa${params.size ? `?${params.toString()}` : ''}`
}

/*
 * Guru's daftar kelas detail mata pelajaran level routes
 */
function daftarKelasDetailMataPelajaran({ kelasId }: { kelasId: Kelas['id'] }) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mata-pelajaran`
}

/*
 * Guru's daftar kelas detail mata pelajaran detail assignment level routes
 */
function daftarKelasDetailMataPelajaranDetailAssignment({
  kelasId,
  mataPelajaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/assignment`
}

function daftarKelasDetailMataPelajaranDetailAssignmentCreate({
  kelasId,
  mataPelajaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/assignment-create`
}

function daftarKelasDetailMataPelajaranDetailAssignmentEdit({
  kelasId,
  mataPelajaranId,
  assignmentId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
  assignmentId: Assignment['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/assignment-edit/${assignmentId}`
}

function daftarKelasDetailMataPelajaranDetailAssignmentDetail({
  kelasId,
  mataPelajaranId,
  assignmentId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
  assignmentId: Assignment['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/assignment-detail/${assignmentId}`
}

/*
 * Guru's daftar kelas detail mata pelajaran detail attachment level routes
 */
function daftarKelasDetailMataPelajaranDetailAttachment({
  kelasId,
  mataPelajaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/attachment`
}

function daftarKelasDetailMataPelajaranDetailAttachmentCreate({
  kelasId,
  mataPelajaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/attachment-create`
}

function daftarKelasDetailMataPelajaranDetailAttachmentEdit({
  kelasId,
  mataPelajaranId,
  attachmentId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
  attachmentId: MataPelajaranAttachment['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/attachment-edit/${attachmentId}`
}

function daftarKelasDetailMataPelajaranDetailAttachmentDetail({
  kelasId,
  mataPelajaranId,
  attachmentId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
  attachmentId: MataPelajaranAttachment['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/attachment-detail/${attachmentId}`
}

/*
 * Guru's daftar kelas detail mata pelajaran detail penilaian level routes
 */
function daftarKelasDetailMataPelajaranDetailPenilaian({
  kelasId,
  mataPelajaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/penilaian`
}

/*
 * Guru's daftar kelas detail mata pelajaran detail pelanggaran level routes
 */
function daftarKelasDetailMataPelajaranDetailPelanggaran({
  kelasId,
  mataPelajaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/pelanggaran`
}

function daftarKelasDetailMataPelajaranDetailPelanggaranCreate({
  kelasId,
  mataPelajaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/pelanggaran-create`
}

function daftarKelasDetailMataPelajaranDetailPelanggaranEdit({
  kelasId,
  mataPelajaranId,
  pelanggaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
  pelanggaranId: PelanggaranPerMapel['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/pelanggaran-edit/${pelanggaranId}`
}

function daftarKelasDetailMataPelajaranDetailPelanggaranDetail({
  kelasId,
  mataPelajaranId,
  pelanggaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
  pelanggaranId: PelanggaranPerMapel['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/pelanggaran-detail/${pelanggaranId}`
}

/*
 * Guru's daftar kelas detail mata pelajaran detail berita acara level routes
 */
function daftarKelasDetailMataPelajaranDetailBeritaAcara({
  kelasId,
  mataPelajaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/berita-acara`
}

function daftarKelasDetailMataPelajaranDetailBeritaAcaraCreate({
  kelasId,
  mataPelajaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/berita-acara-create`
}

function daftarKelasDetailMataPelajaranDetailBeritaAcaraEdit({
  kelasId,
  mataPelajaranId,
  beritaAcaraId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
  beritaAcaraId: MataPelajaranBeritaAcara['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/berita-acara-edit/${beritaAcaraId}`
}

function daftarKelasDetailMataPelajaranDetailBeritaAcaraDetail({
  kelasId,
  mataPelajaranId,
  beritaAcaraId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
  beritaAcaraId: MataPelajaranBeritaAcara['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/berita-acara-detail/${beritaAcaraId}`
}

/*
 * Guru's daftar kelas detail absensi level routes
 */
function daftarKelasDetailAbsensiList({ kelasId }: { kelasId: Kelas['id'] }) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/absensi`
}

function daftarKelasDetailAbsensiCreate({
  kelasId,
  semesterAjaranId,
}: {
  kelasId: Kelas['id']
  semesterAjaranId?: SemesterAjaran['id']
}) {
  const params = new URLSearchParams()
  if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/absensi/create?${params.toString()}`
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

function manageMataPelajaranDetail({ mataPelajaranId }: { mataPelajaranId: MataPelajaran['id'] }) {
  return `${baseUrl}${manageMataPelajaranUrl}/${mataPelajaranId}/detail`
}

function manageMataPelajaranDetailAssignment({ mataPelajaranId }: { mataPelajaranId: MataPelajaran['id'] }) {
  return `${baseUrl}${manageMataPelajaranUrl}/${mataPelajaranId}/detail/assignment`
}

function manageMataPelajaranDetailAssignmentCreate({ mataPelajaranId }: { mataPelajaranId: MataPelajaran['id'] }) {
  return `${baseUrl}${manageMataPelajaranUrl}/${mataPelajaranId}/detail/assignment-create`
}

function manageMataPelajaranDetailAssignmentEdit({
  mataPelajaranId,
  assignmentId,
}: {
  mataPelajaranId: MataPelajaran['id']
  assignmentId: Assignment['id']
}) {
  return `${baseUrl}${manageMataPelajaranUrl}/${mataPelajaranId}/detail/assignment-edit/${assignmentId}`
}

function manageMataPelajaranDetailAttachment({ mataPelajaranId }: { mataPelajaranId: MataPelajaran['id'] }) {
  return `${baseUrl}${manageMataPelajaranUrl}/${mataPelajaranId}/detail/attachment`
}

function manageMataPelajaranDetailNilai({ mataPelajaranId }: { mataPelajaranId: MataPelajaran['id'] }) {
  return `${baseUrl}${manageMataPelajaranUrl}/${mataPelajaranId}/detail/nilai`
}

function manageMataPelajaranDetailPelanggaran({ mataPelajaranId }: { mataPelajaranId: MataPelajaran['id'] }) {
  return `${baseUrl}${manageMataPelajaranUrl}/${mataPelajaranId}/detail/pelanggaran`
}

/*
 * Guru's manage ekstrakulikuler level routes
 */
const manageEkstrakulikulerUrl = '/manage-mata-pelajaran'

function manageEkstrakulikuler() {
  return `${baseUrl}${manageEkstrakulikulerUrl}`
}

/*
 * Guru's manage assignment level routes
 */
const manageAssignmentUrl = '/manage-assignment'

function manageAssignmentDetail({ assignmentId }: { assignmentId: Assignment['id'] }) {
  return `${baseUrl}${manageAssignmentUrl}/${assignmentId}/detail`
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

function manageAbsensiCreate() {
  return `${baseUrl}${manageAbsensiUrl}/create`
}

function manageAbsensiEdit({ absensiId }: { absensiId: Absensi['id'] }) {
  return `${baseUrl}${manageAbsensiUrl}/${absensiId}/edit`
}

function manageAbsensiMutate({ absensiId }: { absensiId: Absensi['id'] }) {
  return `${baseUrl}${manageAbsensiUrl}/${absensiId}/mutate`
}

const guru = {
  baseUrl,
  dashboard,
  jadwalMengajar,
  daftarKelas,
  daftarKelasDetail,
  daftarKelasDetailDaftarSiswa,
  daftarKelasDetailMataPelajaran,
  daftarKelasDetailMataPelajaranDetailAssignment,
  daftarKelasDetailMataPelajaranDetailAssignmentCreate,
  daftarKelasDetailMataPelajaranDetailAssignmentEdit,
  daftarKelasDetailMataPelajaranDetailAssignmentDetail,
  daftarKelasDetailMataPelajaranDetailAttachment,
  daftarKelasDetailMataPelajaranDetailAttachmentCreate,
  daftarKelasDetailMataPelajaranDetailAttachmentEdit,
  daftarKelasDetailMataPelajaranDetailAttachmentDetail,
  daftarKelasDetailMataPelajaranDetailPenilaian,
  daftarKelasDetailMataPelajaranDetailPelanggaran,
  daftarKelasDetailMataPelajaranDetailPelanggaranCreate,
  daftarKelasDetailMataPelajaranDetailPelanggaranEdit,
  daftarKelasDetailMataPelajaranDetailPelanggaranDetail,
  daftarKelasDetailMataPelajaranDetailBeritaAcara,
  daftarKelasDetailMataPelajaranDetailBeritaAcaraCreate,
  daftarKelasDetailMataPelajaranDetailBeritaAcaraEdit,
  daftarKelasDetailMataPelajaranDetailBeritaAcaraDetail,
  daftarKelasDetailAbsensiList,
  daftarKelasDetailAbsensiCreate,
  absensiSiswa,
  manageMataPelajaran,
  manageMataPelajaranDetail,
  manageMataPelajaranDetailAssignment,
  manageMataPelajaranDetailAssignmentCreate,
  manageMataPelajaranDetailAssignmentEdit,
  manageMataPelajaranDetailAttachment,
  manageMataPelajaranDetailNilai,
  manageMataPelajaranDetailPelanggaran,
  manageEkstrakulikuler,
  manageAssignmentDetail,
  masterPengumuman,
  masterPengumumanCreate,
  masterPengumumanDetail,
  masterPengumumanEdit,
  manageAbsensi,
  manageAbsensiCreate,
  manageAbsensiEdit,
  manageAbsensiMutate,
}

export default guru
