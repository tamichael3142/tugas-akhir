const baseUrl = '/action/admin'

function importExcelUser() {
  return `${baseUrl}/import-excel-user`
}

const adminAction = {
  importExcelUser,
}

export default adminAction
