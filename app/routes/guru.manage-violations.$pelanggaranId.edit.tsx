import { PelanggaranPerMapel, Role } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { resolver } from '~/pages/guru/ManageViolations/Create/form'
import GuruManageViolationsEditPage from '~/pages/guru/ManageViolations/Edit'
import { GuruManageViolationsCreateFormType } from '~/pages/guru/ManageViolations/form-types'
import { ActionDataGuruManageViolationsEdit } from '~/types/actions-data/guru'
import { LoaderDataGuruManageViolationsEdit } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageViolationsEdit
}

export async function loader({ params, request }: LoaderFunctionArgs): Promise<LoaderDataGuruManageViolationsEdit> {
  const userId = await requireAuthCookie(request)
  const pelanggaranId = params.pelanggaranId as PelanggaranPerMapel['id'] | null

  const siswas = await prisma.akun.findMany({
    where: { role: Role.SISWA, deletedAt: null },
    orderBy: [{ firstName: 'asc' }],
  })

  const kelass = await prisma.kelas.findMany({
    where: {
      deletedAt: null,
      OR: [{ waliId: userId }, { jadwalPelajarans: { some: { mataPelajaran: { guruId: userId } } } }],
    },
    orderBy: [{ nama: 'asc' }],
  })

  const mataPelajarans = await prisma.mataPelajaran.findMany({
    where: { deletedAt: null, guruId: userId },
    orderBy: [{ nama: 'asc' }],
  })

  const pelanggaran = await prisma.pelanggaranPerMapel.findUnique({
    where: { id: pelanggaranId ?? '' },
  })

  return { siswas, kelass, mataPelajarans, pelanggaran } as LoaderDataGuruManageViolationsEdit
}

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataGuruManageViolationsEdit> {
  const { errors, data } = await getValidatedFormData<GuruManageViolationsCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const pelanggaranId = params.pelanggaranId as PelanggaranPerMapel['id'] | null

  try {
    if (!pelanggaranId)
      throw {
        message: 'Violation not found!',
      }

    return await prisma.pelanggaranPerMapel
      .update({
        where: { id: pelanggaranId },
        data: {
          siswaId: data.siswaId,
          kelasId: data.kelasId,
          mataPelajaranId: data.mataPelajaranId,
          poin: data.poin,
          remark: data.remark,
          updatedAt: new Date(),
          lastUpdateById: userId,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Violation updated!',
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

export default function GuruManageViolationsEditRoute() {
  return <GuruManageViolationsEditPage />
}
