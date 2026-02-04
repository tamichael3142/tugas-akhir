import { Kelas, SemesterAjaran } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { AdminMasterKelasManageJadwalFormType, resolver } from '~/pages/admin/MasterKelas/ManageJadwal/form'
import AdminMasterKelasManageSiswaPage from '~/pages/admin/MasterKelas/ManageSiswa'
import { ActionDataAdminMasterKelasManageJadwal } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterKelasManageSiswa } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterKelasManageSiswa
}

export async function loader({ request, params }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterKelasManageSiswa> {
  const kelasId = params.kelasId as Kelas['id'] | null

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId ?? '' },
    include: {
      tahunAjaran: {
        include: { semesterAjaran: true },
      },
      wali: true,
    },
  })

  const siswaPerKelasPerSemesters = await getPaginatedData({
    request,
    model: prisma.siswaPerKelasDanSemester,
    options: {
      defaultLimit: 50,
      include: {
        siswa: true,
      },
      where: {
        kelasId: kelasId,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            // ? Ini untuk search ke data yang di dalam reference
            { siswa: { is: { username: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { nip: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { displayName: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { firstName: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { lastName: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { email: { contains: search, mode: 'insensitive' } } } },
          ]
        }

        const semesterAjaranId = query.get('semesterAjaranId')
        if (semesterAjaranId) where.semesterAjaranId = semesterAjaranId

        return where
      },
      orderBy: [{ siswa: { createdAt: 'desc' } }],
    },
  })

  return { kelas, siswaPerKelasPerSemesters } as LoaderDataAdminMasterKelasManageSiswa
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
        code: 401,
        message: 'Kelas dan/atau Semester Ajaran tidak ditemukan!',
      }

    return await prisma
      .$transaction(async tx => {
        for (const row of data.jadwalPelajarans) {
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
      })
      .then(() => {
        return {
          success: true,
          message: 'Jadwal pelajaran berhasil diupdate!',
          data: {},
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

export default function AdminMasterKelasManageSiswaRoute() {
  return <AdminMasterKelasManageSiswaPage />
}
