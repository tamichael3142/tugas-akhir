import { Akun, Kelas, Role } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { resolver } from '~/pages/admin/MasterKelas/Create/form'
import AdminMasterKelasEditPage from '~/pages/admin/MasterKelas/Edit'
import { AdminMasterKelasCreateFormType } from '~/pages/admin/MasterKelas/form-types'
import { ActionDataAdminMasterKelasEdit } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterKelasEdit } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterKelas
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterKelasEdit> {
  const kelasId = params.kelasId as Akun['id'] | null
  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId ?? '' },
    include: { tahunAjaran: true, wali: true },
  })

  const tahunAjarans = await prisma.tahunAjaran.findMany({ where: { deletedAt: null } })
  const gurus = await prisma.akun.findMany({
    where: { role: Role.GURU, deletedAt: null },
    orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
  })

  return { kelas, tahunAjarans, gurus }
}

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataAdminMasterKelasEdit> {
  const { errors, data } = await getValidatedFormData<AdminMasterKelasCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const kelasId = params.kelasId as Kelas['id'] | null

    return await prisma.kelas
      .update({
        where: { id: kelasId ?? '' },
        data: {
          nama: data.nama,
          tahunAjaranId: data.tahunAjaranId ?? '',
          // eslint-disable-next-line no-extra-boolean-cast
          waliId: !!data.waliId ? data.waliId : null,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Kelas berhasil diupdate!',
          data: {
            updatedKelas: result,
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

export default function AdminMasterKelasEditRoute() {
  return <AdminMasterKelasEditPage />
}
