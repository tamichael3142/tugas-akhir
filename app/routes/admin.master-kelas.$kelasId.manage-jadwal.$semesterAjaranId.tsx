import { Kelas, SemesterAjaran } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import AdminMasterKelasManageJadwalPage from '~/pages/admin/MasterKelas/ManageJadwal'
import { AdminMasterKelasManageJadwalFormType, resolver } from '~/pages/admin/MasterKelas/ManageJadwal/form'
import { ActionDataAdminMasterKelasManageJadwal } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterKelasManageJadwal } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterKelas
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterKelasManageJadwal> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const semesterAjaranId = params.semesterAjaranId as SemesterAjaran['id'] | null

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId ?? '' },
    include: {
      tahunAjaran: {
        include: { semesterAjaran: true },
      },
      wali: true,
      jadwalPelajarans: {
        where: { semesterAjaranId: semesterAjaranId ?? '' },
      },
    },
  })

  const days = await prisma.days.findMany({ orderBy: { sequenceNumber: 'asc' } })
  const hours = await prisma.hour.findMany({ orderBy: { sequenceNumber: 'asc' } })

  const mataPelajarans = await prisma.mataPelajaran.findMany({
    where: {
      semesterAjaranId: semesterAjaranId ?? '',
    },
    include: { guru: true },
  })

  return { kelas, days, hours, mataPelajarans }
}

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataAdminMasterKelasManageJadwal> {
  const { errors, data } = await getValidatedFormData<AdminMasterKelasManageJadwalFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const kelasId = params.kelasId as Kelas['id'] | null
    const semesterAjaranId = params.semesterAjaranId as SemesterAjaran['id'] | null

    if (!kelasId || !semesterAjaranId)
      throw {
        code: 404,
        message: 'Class and/or Academic Semester not found!',
      }

    // ? Validasi: guru pengajar tidak boleh memiliki jadwal mengajar di kelas lain
    // ? pada hari & jam yang sama dalam semester ajaran yang sama
    const activeRows = data.jadwalPelajarans.filter(row => row.mataPelajaranId)

    const teacherScheduleConflicts: NonNullable<
      ActionDataAdminMasterKelasManageJadwal['data']['teacherScheduleConflicts']
    > = []

    // ? Baris yang bertabrakan jadwal guru-nya tidak ikut disimpan ke DB
    let jadwalPelajaransToSave = data.jadwalPelajarans

    if (activeRows.length > 0) {
      const mataPelajaranIds = [...new Set(activeRows.map(row => row.mataPelajaranId))]

      const mataPelajarans = await prisma.mataPelajaran.findMany({
        where: { id: { in: mataPelajaranIds } },
      })

      const mataPelajaranMap = new Map(mataPelajarans.map(item => [item.id, item]))

      const guruIds = [...new Set(mataPelajarans.map(item => item.guruId).filter((id): id is string => !!id))]

      const otherClassesJadwals = guruIds.length
        ? await prisma.jadwalPelajaran.findMany({
            where: {
              semesterAjaranId,
              kelasId: { not: kelasId },
              mataPelajaran: { guruId: { in: guruIds } },
            },
            include: {
              kelas: true,
              day: true,
              hour: true,
              mataPelajaran: { include: { guru: true } },
            },
          })
        : []

      const conflictRowKeys = new Set<string>()

      for (const row of activeRows) {
        const mataPelajaran = mataPelajaranMap.get(row.mataPelajaranId)
        if (!mataPelajaran?.guruId) continue

        const conflictingJadwal = otherClassesJadwals.find(
          item =>
            item.dayId === row.dayId &&
            item.hourId === row.hourId &&
            item.mataPelajaran.guruId === mataPelajaran.guruId,
        )

        if (conflictingJadwal?.mataPelajaran.guru) {
          teacherScheduleConflicts.push({
            day: conflictingJadwal.day,
            hour: conflictingJadwal.hour,
            guru: conflictingJadwal.mataPelajaran.guru,
            mataPelajaran,
            conflictingJadwal,
          })
          conflictRowKeys.add(`${row.dayId}__${row.hourId}`)
        }
      }

      jadwalPelajaransToSave = data.jadwalPelajarans.filter(row => !conflictRowKeys.has(`${row.dayId}__${row.hourId}`))
    }

    return await prisma
      .$transaction(
        async tx => {
          for (const row of jadwalPelajaransToSave) {
            // 1. DELETE jika mapelId null & id ada
            if (!row.mataPelajaranId && row.id) {
              await tx.jadwalPelajaran.delete({
                where: { id: row.id },
              })
              continue
            }

            // 2. SKIP jika mapelId null & id null
            if (!row.mataPelajaranId && !row.id) {
              continue
            }

            // 3. UPDATE jika id ada
            if (row.id) {
              await tx.jadwalPelajaran.update({
                where: { id: row.id },
                data: {
                  kelasId: kelasId,
                  dayId: row.dayId,
                  hourId: row.hourId,
                  mataPelajaranId: row.mataPelajaranId,
                  semesterAjaranId: row.semesterAjaranId,
                },
              })
              continue
            }

            // 4. CREATE jika id null & mapelId ada
            await tx.jadwalPelajaran.create({
              data: {
                kelasId: kelasId,
                dayId: row.dayId,
                hourId: row.hourId,
                mataPelajaranId: row.mataPelajaranId,
                semesterAjaranId: row.semesterAjaranId,
              },
            })

            await tx.kelas.update({
              where: { id: kelasId },
              data: { lastUpdateById: currUser?.id, updatedAt: new Date() },
            })
          }
        },
        {
          timeout: 20_000,
          maxWait: 15_000,
        },
      )
      .then(() => {
        return {
          success: true,
          message:
            teacherScheduleConflicts.length > 0
              ? `Lesson timetable updated! ${teacherScheduleConflicts.length} schedule(s) were skipped due to teacher conflicts. See details below.`
              : 'Lesson timetable updated!',
          data: teacherScheduleConflicts.length > 0 ? { teacherScheduleConflicts } : {},
        }
      })
      .catch(error => {
        const prismaError = prismaErrorHandler(error)
        throw prismaError
      })
  } catch (error) {
    return {
      success: false,
      error: error,
      message: (error as { message?: string }).message ?? 'Unknown Error!',
      data: {
        oldFormData: data,
      },
    }
  }
}

export default function AdminMasterKelasManageJadwalRoute() {
  return <AdminMasterKelasManageJadwalPage />
}
