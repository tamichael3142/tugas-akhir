import { Kelas, PelanggaranPerKelas, Role } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { ActionDataGuruDaftarKelasDetailPelanggaranEdit } from '~/types/actions-data/guru'
import { LoaderDataGuruDaftarKelasDetailPelanggaranEdit } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import GuruDaftarKelasDetailPelanggaranEditPage from '~/pages/guru/DaftarKelas/Detail/Pelanggaran/Edit'
import { GuruDaftarKelasDetailPelanggaranCreateFormType } from '~/pages/guru/DaftarKelas/Detail/Pelanggaran/form-types'
import { resolver } from '~/pages/guru/DaftarKelas/Detail/Pelanggaran/Create/form'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManagePelanggaran
}

export async function loader({
  params,
  request,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailPelanggaranEdit> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const pelanggaranId = params.pelanggaranId as PelanggaranPerKelas['id'] | null

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

  const pelanggaran = await prisma.pelanggaranPerKelas.findUnique({
    where: { id: pelanggaranId ?? '' },
    include: { siswa: true },
  })

  return { kelas, siswas, pelanggaran } as LoaderDataGuruDaftarKelasDetailPelanggaranEdit
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataGuruDaftarKelasDetailPelanggaranEdit> {
  const { errors, data } = await getValidatedFormData<GuruDaftarKelasDetailPelanggaranCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })
  const pelanggaranId = params.pelanggaranId as PelanggaranPerKelas['id'] | null

  try {
    if (!pelanggaranId) throw { message: 'Violation not found!' }

    return await prisma.pelanggaranPerKelas
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
          message: 'Violation updated!',
          data: { updatedPelanggaran: result },
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

export default function GuruDaftarKelasDetailPelanggaranEditRoute() {
  return <GuruDaftarKelasDetailPelanggaranEditPage />
}
