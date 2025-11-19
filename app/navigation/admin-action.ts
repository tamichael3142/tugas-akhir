const baseUrl = '/action/admin'

function importExcelUser() {
  return `${baseUrl}/import-excel-user`
}

function masterTahunAjaranDelete({ tahunAjaranId }: { tahunAjaranId: string }) {
  return `${baseUrl}/master-tahun-ajaran/${tahunAjaranId}/delete`
}

function masterKelasDelete({ kelasId }: { kelasId: string }) {
  return `${baseUrl}/master-kelas/${kelasId}/delete`
}

function masterMataPelajaranDelete({ mataPelajaranId }: { mataPelajaranId: string }) {
  return `${baseUrl}/master-mata-pelajaran/${mataPelajaranId}/delete`
}

function masterEkstrakulikulerDelete({ ekstrakulikulerId }: { ekstrakulikulerId: string }) {
  return `${baseUrl}/master-ekstrakulikuler/${ekstrakulikulerId}/delete`
}

function masterPengumumanDelete({ pengumumanId }: { pengumumanId: string }) {
  return `${baseUrl}/master-pengumuman/${pengumumanId}/delete`
}

function masterAccountDelete({ akunId }: { akunId: string }) {
  return `${baseUrl}/master-account/${akunId}/delete`
}

const adminAction = {
  importExcelUser,
  masterTahunAjaranDelete,
  masterKelasDelete,
  masterMataPelajaranDelete,
  masterEkstrakulikulerDelete,
  masterPengumumanDelete,
  masterAccountDelete,
}

export default adminAction
