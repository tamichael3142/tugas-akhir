import { Kelas, Role } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { resolver } from '~/pages/guru/DaftarKelas/Detail/Pelanggaran/Create/form'
import { ActionDataGuruDaftarKelasDetailPelanggaranCreate } from '~/types/actions-data/guru'
import { LoaderDataGuruDaftarKelasDetailPelanggaranCreate } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import GuruDaftarKelasDetailPelanggaranCreatePage from '~/pages/guru/DaftarKelas/Detail/Pelanggaran/Create'
import { GuruDaftarKelasDetailPelanggaranCreateFormType } from '~/pages/guru/DaftarKelas/Detail/Pelanggaran/form-types'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManagePelanggaran
}

export async function loader({ params, request }: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailPelanggaranCreate> {
  const kelasId = params.kelasId as Kelas['id'] | null

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId ?? '' },
    include: {
      tahunAjaran: {
        include: {
          semesterAjaran: true,
        },
      },
      wali: true,
    },
  })

  const url = new URL(request.url)
  const search = url.searchParams.get('search')
  const semesterAjaranIds = kelas?.tahunAjaran.semesterAjaran.map(s => s.id) ?? []

  let where: object = {}
  if (search)
    where = {
      OR: [
        { username: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }

  const siswas = await prisma.akun.findMany({
    where: {
      ...where,
      siswaPerKelasDanSemester: {
        some: {
          ...(kelasId && { kelasId }),
          ...(semesterAjaranIds.length > 0 && { semesterAjaranId: { in: semesterAjaranIds } }),
        },
      },
      role: Role.SISWA,
      deletedAt: null,
    },
    orderBy: [{ firstName: 'asc' }],
  })

  return { kelas, siswas } as LoaderDataGuruDaftarKelasDetailPelanggaranCreate
}

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataGuruDaftarKelasDetailPelanggaranCreate> {
  const { errors, data } = await getValidatedFormData<GuruDaftarKelasDetailPelanggaranCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const kelasId = params.kelasId as Kelas['id'] | null

    return await prisma.pelanggaranPerKelas
      .create({
        data: {
          kelasId: kelasId ?? '',
          siswaId: data.siswaId,
          poin: data.poin,
          remark: data.remark,
          createdById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Violation created!',
          data: { createdPelanggaran: result },
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
      data: { oldFormData: data },
    }
  }
}

export default function GuruDaftarKelasDetailPelanggaranCreateRoute() {
  return <GuruDaftarKelasDetailPelanggaranCreatePage />
}
