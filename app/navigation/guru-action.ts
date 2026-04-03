import { Kelas, MataPelajaran, MataPelajaranAttachment, SemesterAjaran } from '@prisma/client'

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

const guruAction = {
  baseUrl,
  masterPengumumanDelete,
  daftarKelasDetailAbsensiCreate,
  daftarKelasDetailMataPelajaranDetailAttachmentDelete,
}

export default guruAction
