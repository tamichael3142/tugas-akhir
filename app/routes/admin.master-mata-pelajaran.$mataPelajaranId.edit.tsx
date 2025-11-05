import { MataPelajaran, Role } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { resolver } from '~/pages/admin/MasterMataPelajaran/Create/form'
import { AdminMasterMataPelajaranCreateFormType } from '~/pages/admin/MasterMataPelajaran/form-types'
import { ActionDataAdminMasterMataPelajaranEdit } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterMataPelajaranEdit } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import AdminMasterMataPelajaranEditPage from '~/pages/admin/MasterMataPelajaran/Edit'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterMataPelajaran
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterMataPelajaranEdit> {
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null
  const mataPelajaran = await prisma.mataPelajaran.findUnique({
    where: { id: mataPelajaranId ?? '' },
    include: { semesterAjaran: { include: { tahunAjaran: true } }, guru: true },
  })

  const tahunAjarans = await prisma.tahunAjaran.findMany({
    where: { deletedAt: null },
    include: { semesterAjaran: true },
  })
  const gurus = await prisma.akun.findMany({
    where: { role: Role.GURU, deletedAt: null },
    orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
  })

  return { mataPelajaran, tahunAjarans, gurus }
}

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataAdminMasterMataPelajaranEdit> {
  const { errors, data } = await getValidatedFormData<AdminMasterMataPelajaranCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  console.log(data)

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null

    return await prisma.mataPelajaran
      .update({
        where: { id: mataPelajaranId ?? '' },
        data: {
          nama: data.nama,
          semesterAjaranId: data.semesterAjaranId ?? '',
          // eslint-disable-next-line no-extra-boolean-cast
          guruId: !!data.guruId ? data.guruId : null,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Mata pelajaran berhasil diupdate!',
          data: {
            updatedMataPelajaran: result,
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

export default function AdminMasterMataPelajaranEditRoute() {
  return <AdminMasterMataPelajaranEditPage />
}
