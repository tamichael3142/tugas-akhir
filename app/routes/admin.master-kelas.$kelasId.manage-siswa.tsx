import { Kelas } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import AdminMasterKelasManageSiswaPage from '~/pages/admin/MasterKelas/ManageSiswa'
import { LoaderDataAdminMasterKelasManageSiswa } from '~/types/loaders-data/admin'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'
import { AdminMasterKelasDeleteSiswaFormType, resolver } from '~/pages/admin/MasterKelas/ManageSiswa/form'
import { requireAuthCookie } from '~/utils/auth.utils'
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

export async function action({ request, params }: ActionFunctionArgs) {
  const { errors, data } = await getValidatedFormData<AdminMasterKelasDeleteSiswaFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  await requireAuthCookie(request)

  try {
    const kelasId = params.kelasId as Kelas['id'] | null

    return await prisma.siswaPerKelasDanSemester
      .deleteMany({
        where: {
          id: { in: data.siswaPerKelasDanSemesterIds },
          kelasId: kelasId ?? '',
        },
      })
      .then(() => {
        return {
          success: true,
          message: 'Siswa berhasil dihapus dari kelas!',
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
      data: {},
    }
  }
}

export default function AdminMasterKelasManageSiswaRoute() {
  return <AdminMasterKelasManageSiswaPage />
}
