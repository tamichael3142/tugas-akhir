import { Kelas, MataPelajaran, MataPelajaranBeritaAcara } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraEdit } from '~/types/actions-data/guru'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraEdit } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import { GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraCreateFormType } from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/BeritaAcara/form-types'
import { resolver } from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/BeritaAcara/Create/form'
import GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraEditPage from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/BeritaAcara/Edit'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageBeritaAcara
}
export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraEdit> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null
  const beritaAcaraId = params.beritaAcaraId as MataPelajaranBeritaAcara['id'] | null

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

  const days = await prisma.days.findMany({ orderBy: { sequenceNumber: 'asc' } })
  const hours = await prisma.hour.findMany({ orderBy: { sequenceNumber: 'asc' } })

  const beritaAcara = await prisma.mataPelajaranBeritaAcara.findUnique({
    where: { id: beritaAcaraId ?? '' },
    include: {
      day: true,
      hourStart: true,
      hourEnd: true,
    },
  })

  return {
    kelas,
    mataPelajaran,
    days,
    hours,
    beritaAcara,
  } as LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraEdit
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraEdit> {
  const { errors, data } =
    await getValidatedFormData<GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  const beritaAcaraId = params.beritaAcaraId as MataPelajaranBeritaAcara['id'] | null

  try {
    if (!beritaAcaraId)
      throw {
        message: 'Berita Acara tidak ditemukan!',
      }

    // TODO: tambah validator untuk hari jam yang bertabrakan

    return await prisma.mataPelajaranBeritaAcara
      .update({
        where: { id: beritaAcaraId },
        data: {
          title: data.title,
          remark: data.remark,
          dayId: data.dayId,
          hourStartId: data.hourStartId,
          hourEndId: data.hourEndId,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Berita Acara berhasil update!',
          data: {
            updatedBeritaAcara: result,
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

export default function GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraEditRoute() {
  return <GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraEditPage />
}
