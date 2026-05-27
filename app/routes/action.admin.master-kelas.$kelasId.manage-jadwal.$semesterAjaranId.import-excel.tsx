import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import * as XLSX from 'xlsx'
import AppNav from '~/navigation'
import { prisma } from '~/utils/db.server'
import { requireAuthCookie } from '~/utils/auth.utils'
import { Role } from '~/database/enums/prisma.enums'
import { AdminMasterKelasManageJadwalFormType } from '~/pages/admin/MasterKelas/ManageJadwal/form'
import { Kelas, SemesterAjaran } from '@prisma/client'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ')

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireAuthCookie(request)

  const currUser = await prisma.akun.findUnique({
    where: { id: userId },
  })

  if (currUser?.role !== Role.ADMIN) return redirect(AppNav.main.home())

  const kelasId = params.kelasId as Kelas['id'] | null

  const semesterAjaranId = params.semesterAjaranId as SemesterAjaran['id'] | null

  if (!kelasId || !semesterAjaranId)
    throw {
      message: 'Class or Academic Semester not found!',
    }

  const formData = await request.formData()

  const file = formData.get('file') as File

  if (!file) return json({ error: 'No file uploaded' }, { status: 400 })

  // * Baca file excel

  const arrayBuffer = await file.arrayBuffer()

  const buffer = Buffer.from(arrayBuffer)

  const workbook = XLSX.read(buffer, {
    type: 'buffer',
  })

  const sheetName = workbook.SheetNames[0]

  const worksheet = workbook.Sheets[sheetName]

  const jsonDataRaw = XLSX.utils.sheet_to_json(worksheet)

  // * Get master preload datanya

  const [days, hours, mataPelajarans] = await Promise.all([
    prisma.days.findMany({
      orderBy: {
        sequenceNumber: 'asc',
      },
    }),

    prisma.hour.findMany({
      orderBy: {
        sequenceNumber: 'asc',
      },
    }),

    prisma.mataPelajaran.findMany({
      orderBy: {
        nama: 'asc',
      },
    }),
  ])

  // * Build lookup mapping datanya

  const dayMap = new Map(days.map(item => [normalize(item.id), item]))

  const hourMap = new Map(hours.map(item => [normalize(item.id), item]))

  const mapelMap = new Map(mataPelajarans.map(item => [normalize(item.nama), item]))

  // * Build import datanya

  const jsonData: AdminMasterKelasManageJadwalFormType['jadwalPelajarans'] = []

  const duplicateCheck = new Set<string>()

  for (let i = 0; i < jsonDataRaw.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item: any = jsonDataRaw[i]

    const dayLabel = normalize(String(item['Day'] ?? ''))

    const hourLabel = normalize(String(item['Hour'] ?? ''))

    const mapelNama = normalize(String(item['Subject'] ?? ''))

    const existingDay = dayMap.get(dayLabel)

    const existingHour = hourMap.get(hourLabel)

    const existingMapel = mapelMap.get(mapelNama)

    // * Fail debugger

    if (!existingDay || !existingHour || !existingMapel) {
      console.log('IMPORT FAILED ROW:', {
        row: i + 2,
        dayLabel,
        hourLabel,
        mapelNama,
        existingDay: !!existingDay,
        existingHour: !!existingHour,
        existingMapel: !!existingMapel,
      })

      continue
    }

    // * Cek duplicate data entry

    const duplicateKey = [existingDay.id, existingHour.id].join('-')

    if (duplicateCheck.has(duplicateKey)) {
      console.log('DUPLICATE ROW:', {
        row: i + 2,
        duplicateKey,
      })

      continue
    }

    duplicateCheck.add(duplicateKey)

    jsonData.push({
      id: null,
      dayId: existingDay.id,
      hourId: existingHour.id,
      mataPelajaranId: existingMapel.id,
      semesterAjaranId,
    })
  }

  console.log('dayMap', dayMap)
  console.log('hourMap', hourMap)
  console.log('mapelMap', mapelMap)
  console.log('jsonData', jsonData)

  // * Simpan ke DB

  return await prisma
    .$transaction(
      async tx => {
        for (const row of jsonData) {
          if (!row.mataPelajaranId) continue

          await tx.jadwalPelajaran.upsert({
            where: {
              dayId_hourId_kelasId_semesterAjaranId: {
                kelasId,
                dayId: row.dayId,
                hourId: row.hourId,
                semesterAjaranId: row.semesterAjaranId,
              },
            },

            update: {
              mataPelajaranId: row.mataPelajaranId,
            },

            create: {
              kelasId,
              dayId: row.dayId,
              hourId: row.hourId,
              semesterAjaranId: row.semesterAjaranId,
              mataPelajaranId: row.mataPelajaranId,
            },
          })
        }

        await tx.kelas.update({
          where: {
            id: kelasId,
          },

          data: {
            lastUpdateById: currUser?.id,

            updatedAt: new Date(),
          },
        })
      },

      {
        timeout: 20_000,
        maxWait: 15_000,
      },
    )
    .then(() => {
      return redirect(
        AppNav.admin.masterKelasManageJadwal({
          id: kelasId,
          semesterAjaranId,
        }),
      )
    })
    .catch(error => {
      throw prismaErrorHandler(error)
    })
}

export default function AdminImportExcelUserRoute() {
  return <LoadingFullScreen />
}
