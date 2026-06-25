import { Akun } from '@prisma/client'
import * as XLSX from 'xlsx'
import DBHelpers from '~/database/helpers'

function excelDateToJSDate(serial: number) {
  const utc_days = Math.floor(serial - 25569)
  const utc_value = utc_days * 86400
  const date_info = new Date(utc_value * 1000)
  return date_info
}

function downloadExcelFromIds({ fileName, ids }: { ids: (number | string)[]; fileName: string }) {
  // Siapkan data (array of objects)
  const data = ids.map(id => ({ id }))

  // Buat worksheet dari data
  const ws = XLSX.utils.json_to_sheet(data)

  // Buat workbook dan tambahkan worksheet
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws)

  // Generate file dan langsung download
  XLSX.writeFile(wb, fileName)
}

function downloadExcelFromAkun({ fileName, akuns }: { akuns: Akun[]; fileName: string }) {
  // Siapkan data (array of objects)
  const data = akuns.map(akun => ({
    id: akun.id,
    name: DBHelpers.akun.getDisplayName(akun),
    username: akun.username,
    nip: akun.nip,
    email: akun.email,
    password: akun.isChangedPassword ? '' : akun.password,
  }))

  // Buat worksheet dari data
  const ws = XLSX.utils.json_to_sheet(data)

  // Buat workbook dan tambahkan worksheet
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws)

  // Generate file dan langsung download
  XLSX.writeFile(wb, fileName)
}

const XLSXUtils = {
  excelDateToJSDate,
  downloadExcelFromIds,
  downloadExcelFromAkun,
}

export default XLSXUtils
