import { Absensi } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { GuruManageAbsensiMutateFormType } from '~/pages/guru/ManageAbsensi/form-types'
import { resolver } from '~/pages/guru/ManageAbsensi/Mutate/form'
import { ActionDataGuruManageAbsensiMutate } from '~/types/actions-data/guru'
import { LoaderDataGuruManageAbsensiMutate } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import GuruManageAbsensiMutatePage from '~/pages/guru/ManageAbsensi/Mutate'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageAbsensi
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataGuruManageAbsensiMutate> {
  const absensiId = params.absensiId as Absensi['id'] | null
  const absensi = await prisma.absensi.findUnique({
    where: { id: absensiId ?? '' },
    include: {
      siswaTerabsen: true,
    },
  })

  const siswaPerKelasPerSemesters = await prisma.siswaPerKelasDanSemester.findMany({
    include: {
      siswa: true,
    },
    where: {
      kelasId: absensi?.kelasId ?? '',
      semesterAjaranId: absensi?.semesterAjaranId ?? '',
    },
    orderBy: [{ siswa: { firstName: 'asc' } }],
  })

  return { absensi, siswaPerKelasPerSemesters } as LoaderDataGuruManageAbsensiMutate
}

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataGuruManageAbsensiMutate> {
  const { errors, data } = await getValidatedFormData<GuruManageAbsensiMutateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const absensiId = params.absensiId as Absensi['id'] | null

    if (!absensiId)
      throw {
        code: 404,
        message: 'Absensi tidak ditemukan!',
      }

    return await prisma
      .$transaction(async tx => {
        for (const row of data.siswaTerabsen) {
          // 1. DELETE jika siswaId null & id ada
          if (!row.siswaId && row.id) {
            await tx.absensiXSiswa.delete({
              where: { id: Number(row.id) },
            })
            continue
          }

          // 2. SKIP jika siswaId null & id null
          if (!row.siswaId && !row.id) {
            continue
          }

          // 3. UPDATE jika id ada
          if (row.id) {
            await tx.absensiXSiswa.update({
              where: { id: Number(row.id) },
              data: {
                absensiId,
                siswaId: row.siswaId ?? '',
                tipe: row.tipe,
              },
            })
            continue
          }

          // 4. CREATE jika id null & siswaId ada
          await tx.absensiXSiswa.create({
            data: {
              absensiId,
              siswaId: row.siswaId ?? '',
              tipe: row.tipe,
            },
          })

          await tx.absensi.update({
            where: { id: absensiId },
            data: { lastUpdateById: currUser?.id, updatedAt: new Date() },
          })
        }
      })
      .then(() => {
        return {
          success: true,
          message: 'Absensi berhasil diupdate!',
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

export default function GuruManageAbsensiMutateRoute() {
  return <GuruManageAbsensiMutatePage />
}
