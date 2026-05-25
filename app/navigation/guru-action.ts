import { Kelas, MataPelajaran, MataPelajaranAttachment, PelanggaranPerMapel, SemesterAjaran } from '@prisma/client'

const baseUrl = '/action/guru'

function masterPengumumanDelete({ pengumumanId }: { pengumumanId: string }) {
  return `${baseUrl}/master-pengumuman/${pengumumanId}/delete`
}

const daftarKelasUrl = '/daftar-kelas'

function daftarKelasDetailAbsensiCreate({
  kelasId,
  semesterAjaranId,
}: {
  kelasId: Kelas['id']
  semesterAjaranId?: SemesterAjaran['id']
}) {
  const params = new URLSearchParams()
  if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/absensi-create?${params.toString()}`
}

function daftarKelasDetailMataPelajaranDetailAttachmentDelete({
  kelasId,
  mataPelajaranId,
  attachmentId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
  attachmentId: MataPelajaranAttachment['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/attachment/${attachmentId}/delete`
}

function daftarKelasDetailMataPelajaranDetailPelanggaranDelete({
  kelasId,
  mataPelajaranId,
  pelanggaranId,
}: {
  kelasId: Kelas['id']
  mataPelajaranId: MataPelajaran['id']
  pelanggaranId: PelanggaranPerMapel['id']
}) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/detail/mapel/${mataPelajaranId}/pelanggaran/${pelanggaranId}/delete`
}

function accountUploadProfileImage() {
  return `${baseUrl}/account/upload-profile-image`
}

const guruAction = {
  baseUrl,
  masterPengumumanDelete,
  daftarKelasDetailAbsensiCreate,
  daftarKelasDetailMataPelajaranDetailAttachmentDelete,
  daftarKelasDetailMataPelajaranDetailPelanggaranDelete,
  accountUploadProfileImage,
}

export default guruAction
