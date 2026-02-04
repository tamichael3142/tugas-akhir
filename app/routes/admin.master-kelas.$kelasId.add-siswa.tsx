import { Kelas, Role } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import AdminMasterKelasAddSiswaPage from '~/pages/admin/MasterKelas/AddSiswa'
import { AdminMasterKelasAddSiswaFormType, resolver } from '~/pages/admin/MasterKelas/AddSiswa/form'
import { ActionDataAdminMasterKelasAddSiswa } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterKelasAddSiswa } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterKelasAddSiswa
}

export async function loader({ request, params }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterKelasAddSiswa> {
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

  const siswaPerKelasPerSemesters = await prisma.siswaPerKelasDanSemester.findMany({
    where: {
      kelasId: kelasId ?? '',
    },
    include: { semesterAjaran: true },
  })

  const availableSiswas = await getPaginatedData({
    request,
    model: prisma.akun,
    options: {
      defaultLimit: 50,
      where: {
        role: Role.SISWA,
        deletedAt: null,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            { username: { contains: search, mode: 'insensitive' } },
            { nip: { contains: search, mode: 'insensitive' } },
            { displayName: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ]
        }

        return where
      },
      orderBy: [{ createdAt: 'desc' }],
    },
  })

  return { kelas, siswaPerKelasPerSemesters, availableSiswas } as LoaderDataAdminMasterKelasAddSiswa
}

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataAdminMasterKelasAddSiswa> {
  const { errors, data } = await getValidatedFormData<AdminMasterKelasAddSiswaFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const kelasId = params.kelasId as Kelas['id'] | null
    if (!kelasId)
      throw {
        code: 401,
        message: 'Kelas tidak ditemukan!',
      }

    return await prisma
      .$transaction(async tx => {
        const kelas = await tx.kelas.findUnique({
          where: { id: kelasId },
          include: { tahunAjaran: { include: { semesterAjaran: true } } },
        })

        const semesterSatu = kelas?.tahunAjaran.semesterAjaran.find(item => item.urutan === SemesterAjaranUrutan.SATU)
        const semesterDua = kelas?.tahunAjaran.semesterAjaran.find(item => item.urutan === SemesterAjaranUrutan.DUA)
        if (!semesterSatu || !semesterDua)
          throw {
            code: 401,
            message: 'Semester ajaran tidak ditemukan!',
          }

        const existing = await tx.siswaPerKelasDanSemester.findMany({
          where: { kelasId: kelasId },
          include: { semesterAjaran: true },
        })

        for (const row of existing) {
          if (row.semesterAjaran?.urutan === SemesterAjaranUrutan.SATU && !data.semester1Ids.includes(row.siswaId)) {
            await tx.siswaPerKelasDanSemester.delete({ where: { id: row.id } })
            continue
          }
          if (row.semesterAjaran?.urutan === SemesterAjaranUrutan.DUA && !data.semester2Ids.includes(row.siswaId)) {
            await tx.siswaPerKelasDanSemester.delete({ where: { id: row.id } })
            continue
          }
        }

        for (const siswaId of data.semester1Ids) {
          const exists = existing.find(
            e => e.siswaId === siswaId && e.semesterAjaran?.urutan === SemesterAjaranUrutan.SATU,
          )
          if (!exists) {
            await tx.siswaPerKelasDanSemester.create({
              data: { kelasId: kelasId, siswaId, semesterAjaranId: semesterSatu.id },
            })
          }
        }

        for (const siswaId of data.semester2Ids) {
          const exists = existing.find(
            e => e.siswaId === siswaId && e.semesterAjaran?.urutan === SemesterAjaranUrutan.DUA,
          )
          if (!exists) {
            await tx.siswaPerKelasDanSemester.create({
              data: { kelasId: kelasId, siswaId, semesterAjaranId: semesterDua.id },
            })
          }
        }

        await tx.kelas.update({
          where: { id: kelasId },
          data: { lastUpdateById: currUser?.id, updatedAt: new Date() },
        })
      })
      .then(() => {
        return {
          success: true,
          message: 'Siswa per kelas berhasil diupdate!',
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

export default function AdminMasterKelasAddSiswaRoute() {
  return <AdminMasterKelasAddSiswaPage />
}
