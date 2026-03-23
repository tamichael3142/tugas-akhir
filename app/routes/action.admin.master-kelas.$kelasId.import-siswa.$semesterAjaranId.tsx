import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import * as XLSX from 'xlsx'
import AppNav from '~/navigation'
import { prisma } from '~/utils/db.server'
import { requireAuthCookie } from '~/utils/auth.utils'
import { Role } from '~/database/enums/prisma.enums'
import { Akun, Kelas, SemesterAjaran } from '@prisma/client'

export async function action({ request, params }: ActionFunctionArgs) {
  const kelasId = params.kelasId as Kelas['id'] | null
  const semesterAjaranId = params.semesterAjaranId as SemesterAjaran['id'] | null

  if (!kelasId || !semesterAjaranId)
    return json({ error: 'Kelas Id or Semester Ajaran Id not found!' }, { status: 400 })

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

  const newSiswaIds: Akun['id'][] = []

  for (let i = 0; i < jsonDataRaw.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item: any = jsonDataRaw[i]
    const currId = ((item['id'] ?? '') as string).trim()
    if (currId) newSiswaIds.push(currId)
  }

  try {
    await prisma.$transaction(async tx => {
      const existing = await tx.siswaPerKelasDanSemester.findMany({
        where: { kelasId: kelasId, semesterAjaranId: semesterAjaranId },
      })

      for (const siswaId of newSiswaIds) {
        const exists = existing.find(e => e.siswaId === siswaId)
        if (!exists) {
          await tx.siswaPerKelasDanSemester.create({
            data: { kelasId: kelasId, siswaId, semesterAjaranId: semesterAjaranId },
          })
        }
      }

      await tx.kelas.update({
        where: { id: kelasId },
        data: { lastUpdateById: currUser?.id, updatedAt: new Date() },
      })
    })

    return redirect(AppNav.admin.masterKelasAddSiswa({ id: kelasId }))
  } catch (error) {
    return {
      success: false,
      error: error,
      message: (error as { message?: string }).message ?? 'Unknown Error!',
      data: {
        newSiswaIds,
      },
    }
  }
}

export default function AdminMasterKelasImportSiswaRoute() {
  return <LoadingFullScreen />
}
