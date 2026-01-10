import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import * as XLSX from 'xlsx'
import AppNav from '~/navigation'
import XLSXUtils from '~/utils/xlsx.utils'
import EnumsValueUtils from '~/utils/enums-value.utils'
import { AdminDashboardInsertBulkAkunFormType } from '~/pages/admin/Dashboard/form'
import { prisma } from '~/utils/db.server'
import DBHelpers from '~/database/helpers'
import { requireAuthCookie } from '~/utils/auth.utils'
import { Role } from '~/database/enums/prisma.enums'

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })
  if (currUser?.role !== Role.ADMIN) return redirect(AppNav.main.home())

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
  const jsonData: AdminDashboardInsertBulkAkunFormType['newUsers'] = []

  for (let i = 0; i < jsonDataRaw.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item: any = jsonDataRaw[i]
    const firstName = (item['Nama Depan'] ?? '') as string
    const lastName = (item['Nama Belakang'] ?? '') as string
    const tanggalLahir = XLSXUtils.excelDateToJSDate(item['Tanggal Lahir']).toISOString()
    const username = DBHelpers.akun.generateUsername({
      firstName,
      lastName,
      tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : new Date('2000-01-01'),
    })

    jsonData.push({
      firstName,
      lastName,
      tempatLahir: (item['Tempat Lahir'] ?? null) as string | null,
      tanggalLahir,
      role: EnumsValueUtils.getRole(item['Role']),
      username,
      password: (item['Password'] ?? username ?? '') as string,
      email: (item['Email'] ?? null) as string | null,
      jenisKelamin: EnumsValueUtils.getJenisKelamin(item['Jenis Kelamin']),
      agama: (item['Agama'] ?? null) as string | null,
      alamat: (item['Alamat'] ?? null) as string | null,
      golonganDarah: EnumsValueUtils.getGolonganDarah(item['Gol Darah']),
      kewarganegaraan: EnumsValueUtils.getKewarganegaraan(item['Kewarganegaraan']),
    })
  }

  await prisma.tempAkun.createManyAndReturn({
    data: jsonData.map(item => ({
      ...item,
      createdById: currUser?.id,
    })),
  })

  return redirect(AppNav.admin.dashboard())
}

export default function AdminImportExcelUserRoute() {
  return <LoadingFullScreen />
}
