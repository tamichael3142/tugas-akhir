import { Kelas, MataPelajaran } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import DBUtils from '~/database/utils'
import GuruDaftarKelasDetailMataPelajaranDetailPenilaianPage from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Penilaian'
import {
  GuruDaftarKelasDetailMataPelajaranDetailPenilaianFormType,
  resolver,
} from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Penilaian/form'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailPenilaian } from '~/types/actions-data/guru'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPenilaian } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManagePenilaian
}
export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPenilaian> {
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

  const kompetensis = await prisma.kompetensi.findMany({
    orderBy: { sequenceNumber: 'asc' },
  })

  const siswaPerKelasPerSemesters = await prisma.siswaPerKelasDanSemester.findMany({
    where: {
      kelasId: kelasId ?? undefined,
      semesterAjaranId: mataPelajaran?.semesterAjaranId,
    },
    include: {
      siswa: true,
    },
  })

  const penilaians = await prisma.penilaian.findMany({
    where: {
      kelasId: kelasId ?? undefined,
      mataPelajaranId: mataPelajaran?.id,
    },
  })

  return {
    kelas,
    mataPelajaran,
    kompetensis,
    siswaPerKelasPerSemesters,
    penilaians: [
      ...penilaians.map(item => ({
        ...item,
        nilai: DBUtils.decimal.decimalToNumber(item.nilai),
      })),
    ],
  } as LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPenilaian
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataGuruDaftarKelasDetailMataPelajaranDetailPenilaian> {
  const { errors, data } = await getValidatedFormData<GuruDaftarKelasDetailMataPelajaranDetailPenilaianFormType>(
    request,
    resolver,
  )
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const kelasId = params.kelasId as Kelas['id'] | null
    const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null

    if (!currUser)
      throw {
        code: 404,
        message: 'User tidak ditemukan!',
      }

    if (!kelasId || !mataPelajaranId)
      throw {
        code: 404,
        message: 'Kelas dan/atau Mata Pelajaran tidak ditemukan!',
      }

    return await prisma
      .$transaction(async tx => {
        for (const row of data.penilaians) {
          // 1. DELETE jika nilai tidak ada valuenya & id ada
          if (!row.nilai && row.id) {
            await tx.penilaian.delete({
              where: { id: row.id },
            })
            continue
          }

          // 2. SKIP jika nilai tidak ada valuenya & id null
          if (!row.mataPelajaranId && !row.id) {
            continue
          }

          // 3. UPDATE jika id ada
          if (row.id) {
            await tx.penilaian.update({
              where: { id: row.id },
              data: {
                kelasId: kelasId,
                mataPelajaranId: mataPelajaranId,
                kompetensiId: row.kompetensiId,
                siswaId: row.siswaId,
                nilai: row.nilai,
                updatedAt: new Date(),
              },
            })
            continue
          }

          // 4. CREATE jika id null & nilai ada valuenya
          await tx.penilaian.create({
            data: {
              kelasId: kelasId,
              mataPelajaranId: mataPelajaranId,
              kompetensiId: row.kompetensiId,
              siswaId: row.siswaId,
              nilai: row.nilai,
              createdAt: new Date(),
            },
          })
        }
      })
      .then(() => {
        return {
          success: true,
          message: 'Penilaian berhasil diupdate!',
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

export default function GuruDaftarKelasDetailMataPelajaranDetailPenilaianRoute() {
  return <GuruDaftarKelasDetailMataPelajaranDetailPenilaianPage />
}
