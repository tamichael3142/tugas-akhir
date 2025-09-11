import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import * as XLSX from 'xlsx'
import * as dateFns from 'date-fns'
import AppNav from '~/navigation'
import XLSXUtils from '~/utils/xlsx.utils'
import constants from '~/constants'
import EnumsValueUtils from '~/utils/enums-value.utils.server'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) return json({ error: 'No file uploaded' }, { status: 400 })

  // Convert file ke Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Parse Excel
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonData = XLSX.utils.sheet_to_json(worksheet).map((item: any) => ({
    displayName: (item['Nama Lengkap'] ?? null) as string | null,
    tempatLahir: (item['Tempat Lahir'] ?? null) as string | null,
    tanggalLahir: dateFns.format(
      XLSXUtils.excelDateToJSDate(item['Tanggal Lahir']),
      constants.dateFormats.rawDateInput,
    ),
    role: EnumsValueUtils.getRole(item['Role']),
    username: (item['Username'] ?? null) as string | null,
    password: (item['Password'] ?? null) as string | null,
    email: (item['Email'] ?? null) as string | null,
    gender: EnumsValueUtils.getJenisKelamin(item['Jenis Kelamin']),
    agama: (item['Agama'] ?? null) as string | null,
    alamat: (item['Alamat'] ?? null) as string | null,
    golDarah: EnumsValueUtils.getGolonganDarah(item['Gol Darah']),
    kewarganegaraan: EnumsValueUtils.getKewarganegaraan(item['Kewarganegaraan']),
  }))

  console.log(jsonData)

  return redirect(AppNav.admin.dashboard())
}

export default function AdminImportExcelUserRoute() {
  return <LoadingFullScreen />
}
