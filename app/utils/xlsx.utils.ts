import * as XLSX from 'xlsx'

function excelDateToJSDate(serial: number) {
  const utc_days = Math.floor(serial - 25569)
  const utc_value = utc_days * 86400
  const date_info = new Date(utc_value * 1000)
  return date_info
}

function downloadExcelFromIds({ fileName, ids }: { ids: (number | string)[]; fileName: string }) {
  // 1️⃣ Siapkan data (array of objects)
  const data = ids.map(id => ({ id }))

  // 2️⃣ Buat worksheet dari data
  const ws = XLSX.utils.json_to_sheet(data)

  // 3️⃣ Buat workbook dan tambahkan worksheet
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws)

  // 4️⃣ Generate file dan langsung download
  XLSX.writeFile(wb, fileName)
}

const XLSXUtils = {
  excelDateToJSDate,
  downloadExcelFromIds,
}

export default XLSXUtils
