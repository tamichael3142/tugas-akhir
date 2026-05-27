import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import * as XLSX from 'xlsx'
import AppNav from '~/navigation'
import { prisma } from '~/utils/db.server'
import { requireAuthCookie } from '~/utils/auth.utils'
import { Role } from '~/database/enums/prisma.enums'
import { AdminMasterKelasCreateFormType } from '~/pages/admin/MasterKelas/form-types'

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
  const jsonData: AdminMasterKelasCreateFormType[] = []

  for (let i = 0; i < jsonDataRaw.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item: any = jsonDataRaw[i]
    const tahunAjaranLabel = ((item['Academic Year'] ?? '') as string).trim()
    const waliDisplayName = ((item['Homeroom Teacher'] ?? '') as string).trim()
    const splitedWaliName = waliDisplayName.split(' ')
    const waliFirstName = splitedWaliName[0]
    const waliLastName = splitedWaliName[1]
    const nama = ((item['Name'] ?? '') as string).trim()

    const existingTahunAjaran = await prisma.tahunAjaran.findMany({
      where: { OR: [{ id: tahunAjaranLabel }, { nama: tahunAjaranLabel }] },
      orderBy: { tahunMulai: 'desc' },
    })

    const existingWali = await prisma.akun.findMany({
      where: { OR: [{ id: waliDisplayName }, { firstName: waliFirstName, lastName: waliLastName, role: Role.GURU }] },
      orderBy: { createdAt: 'desc' },
    })

    if (!!existingTahunAjaran && !!existingTahunAjaran[0] && !!existingWali && !!existingWali[0])
      jsonData.push({
        tahunAjaranId: existingTahunAjaran[0].id,
        waliId: existingWali[0].id,
        nama,
      })
  }

  await prisma.kelas.createManyAndReturn({
    data: jsonData.map(item => ({
      ...item,
      createdById: currUser?.id,
    })),
  })

  return redirect(AppNav.admin.masterKelas())
}

export default function AdminImportExcelUserRoute() {
  return <LoadingFullScreen />
}
