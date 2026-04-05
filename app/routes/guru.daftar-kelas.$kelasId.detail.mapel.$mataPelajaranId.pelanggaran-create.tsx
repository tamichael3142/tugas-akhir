import { Kelas, MataPelajaran, Role } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { resolver } from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Pelanggaran/Create/form'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreate } from '~/types/actions-data/guru'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreate } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreatePage from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Pelanggaran/Create'
import { GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateFormType } from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Pelanggaran/form-types'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManagePelanggaran
}
export async function loader({
  params,
  request,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreate> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null

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

  const mataPelajaran = await prisma.mataPelajaran.findUnique({
    where: { id: mataPelajaranId ?? '' },
    include: {
      semesterAjaran: {
        include: {
          tahunAjaran: true,
        },
      },
      guru: true,
    },
  })

  const url = new URL(request.url)
  const query = url.searchParams
  const search = query.get('search')

  const semesterAjaranId = mataPelajaran?.semesterAjaranId

  let where: object = {}

  if (search)
    where = {
      ...where,
      OR: [
        { username: { contains: search, mode: 'insensitive' } },
        { nip: { contains: search, mode: 'insensitive' } },
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
          ...(semesterAjaranId && { semesterAjaranId }),
        },
      },
      role: Role.SISWA,
      deletedAt: null,
    },
    orderBy: [{ createdAt: 'desc' }, { firstName: 'asc' }],
  })

  return { kelas, mataPelajaran, siswas } as LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreate
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreate> {
  const { errors, data } =
    await getValidatedFormData<GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const kelasId = params.kelasId as Kelas['id'] | null
    const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null

    return await prisma.pelanggaranPerMapel
      .create({
        data: {
          mataPelajaranId: mataPelajaranId ?? '',
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
          message: 'Pelanggaran berhasil dibuat!',
          data: {
            createdPelanggaran: result,
          },
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

export default function GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateRoute() {
  return <GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreatePage />
}
