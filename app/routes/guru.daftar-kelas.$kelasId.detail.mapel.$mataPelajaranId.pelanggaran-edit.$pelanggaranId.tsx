import { Kelas, MataPelajaran, PelanggaranPerMapel, Role } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranEdit } from '~/types/actions-data/guru'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranEdit } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import GuruDaftarKelasDetailMataPelajaranDetailPelanggaranEditPage from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Pelanggaran/Edit'
import { GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateFormType } from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Pelanggaran/form-types'
import { resolver } from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Pelanggaran/Create/form'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManagePelanggaran
}
export async function loader({
  params,
  request,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranEdit> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null
  const pelanggaranId = params.pelanggaranId as PelanggaranPerMapel['id'] | null

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

  const pelanggaran = await prisma.pelanggaranPerMapel.findUnique({
    where: { id: pelanggaranId ?? '' },
  })

  return {
    kelas,
    mataPelajaran,
    siswas,
    pelanggaran,
  } as LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranEdit
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranEdit> {
  const { errors, data } =
    await getValidatedFormData<GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  const pelanggaranId = params.pelanggaranId as PelanggaranPerMapel['id'] | null

  try {
    if (!pelanggaranId)
      throw {
        message: 'Pelanggaran tidak ditemukan!',
      }

    return await prisma.pelanggaranPerMapel
      .update({
        where: { id: pelanggaranId },
        data: {
          siswaId: data.siswaId,
          poin: data.poin,
          remark: data.remark,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Pelanggaran berhasil update!',
          data: {
            updatedPelanggaran: result,
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

export default function GuruDaftarKelasDetailMataPelajaranDetailPelanggaranEditRoute() {
  return <GuruDaftarKelasDetailMataPelajaranDetailPelanggaranEditPage />
}
