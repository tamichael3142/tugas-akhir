import { Kelas, MataPelajaran, MataPelajaranAttachment, PelanggaranPerMapel } from '@prisma/client'

const baseUrl = '/action/guru'

function masterPengumumanDelete({ pengumumanId }: { pengumumanId: string }) {
  return `${baseUrl}/master-pengumuman/${pengumumanId}/delete`
}

const daftarKelasUrl = '/daftar-kelas'

function daftarKelasDetailAbsensiCreate({ kelasId }: { kelasId: Kelas['id'] }) {
  return `${baseUrl}${daftarKelasUrl}/${kelasId}/absensi-create`
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

const manageViolationsUrl = '/manage-violations'

function manageViolationsDelete({ pelanggaranId }: { pelanggaranId: PelanggaranPerMapel['id'] }) {
  return `${baseUrl}${manageViolationsUrl}/${pelanggaranId}/delete`
}

const guruAction = {
  baseUrl,
  masterPengumumanDelete,
  daftarKelasDetailAbsensiCreate,
  daftarKelasDetailMataPelajaranDetailAttachmentDelete,
  daftarKelasDetailMataPelajaranDetailPelanggaranDelete,
  manageViolationsDelete,
  accountUploadProfileImage,
}

export default guruAction
