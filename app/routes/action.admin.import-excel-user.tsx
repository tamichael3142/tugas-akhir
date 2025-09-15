import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import * as XLSX from 'xlsx'
import AppNav from '~/navigation'
import XLSXUtils from '~/utils/xlsx.utils'
import EnumsValueUtils from '~/utils/enums-value.utils'
import { FormType } from '~/pages/admin/Dashboard/form'
import { prisma } from '~/utils/db.server'

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
  const jsonDataRaw = XLSX.utils.sheet_to_json(worksheet)
  const jsonData: FormType['newUsers'] = []

  for (let i = 0; i < jsonDataRaw.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item: any = jsonDataRaw[i]
    jsonData.push({
      displayName: (item['Nama Lengkap'] ?? '') as string,
      tempatLahir: (item['Tempat Lahir'] ?? null) as string | null,
      tanggalLahir: XLSXUtils.excelDateToJSDate(item['Tanggal Lahir']).toISOString(),
      // tanggalLahir: dateFns.format(
      //   XLSXUtils.excelDateToJSDate(item['Tanggal Lahir']),
      //   constants.dateFormats.rawDateInput,
      // ),
      role: EnumsValueUtils.getRole(item['Role']),
      username: (item['Username'] ?? '') as string,
      password: (item['Password'] ?? item['Username'] ?? '') as string,
      email: (item['Email'] ?? null) as string | null,
      jenisKelamin: EnumsValueUtils.getJenisKelamin(item['Jenis Kelamin']),
      agama: (item['Agama'] ?? null) as string | null,
      alamat: (item['Alamat'] ?? null) as string | null,
      golonganDarah: EnumsValueUtils.getGolonganDarah(item['Gol Darah']),
      kewarganegaraan: EnumsValueUtils.getKewarganegaraan(item['Kewarganegaraan']),
    })
  }

  await prisma.tempAkun.createManyAndReturn({
    data: jsonData,
  })

  return redirect(AppNav.admin.dashboard())
}

export default function AdminImportExcelUserRoute() {
  return <LoadingFullScreen />
}
