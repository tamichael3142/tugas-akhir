import { Kelas, SemesterAjaran } from '@prisma/client'

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

const guruAction = {
  baseUrl,
  masterPengumumanDelete,
  daftarKelasDetailAbsensiCreate,
}

export default guruAction
