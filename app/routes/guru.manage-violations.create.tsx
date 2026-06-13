import { Role } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { resolver } from '~/pages/guru/ManageViolations/Create/form'
import GuruManageViolationsCreatePage from '~/pages/guru/ManageViolations/Create'
import { GuruManageViolationsCreateFormType } from '~/pages/guru/ManageViolations/form-types'
import { ActionDataGuruManageViolationsCreate } from '~/types/actions-data/guru'
import { LoaderDataGuruManageViolationsCreate } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageViolationsCreate
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataGuruManageViolationsCreate> {
  const userId = await requireAuthCookie(request)

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

  return { siswas, kelass, mataPelajarans }
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataGuruManageViolationsCreate> {
  const { errors, data } = await getValidatedFormData<GuruManageViolationsCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)

  try {
    return await prisma.pelanggaranPerMapel
      .create({
        data: {
          siswaId: data.siswaId,
          kelasId: data.kelasId,
          mataPelajaranId: data.mataPelajaranId,
          poin: data.poin,
          remark: data.remark,
          createdById: userId,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Violation created!',
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

export default function GuruManageViolationsCreateRoute() {
  return <GuruManageViolationsCreatePage />
}
