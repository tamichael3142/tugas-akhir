const baseUrl = '/action/admin'

function importExcelUser() {
  return `${baseUrl}/import-excel-user`
}

function masterAccountDelete({ akunId }: { akunId: string }) {
  return `${baseUrl}/master-account/${akunId}/delete`
}

const adminAction = {
  importExcelUser,
  masterAccountDelete,
}

export default adminAction
