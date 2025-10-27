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

function masterAccountDelete({ akunId }: { akunId: string }) {
  return `${baseUrl}/master-account/${akunId}/delete`
}

const adminAction = {
  importExcelUser,
  masterTahunAjaranDelete,
  masterKelasDelete,
  masterAccountDelete,
}

export default adminAction
