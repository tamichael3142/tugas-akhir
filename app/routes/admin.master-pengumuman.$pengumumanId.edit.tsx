import { Pengumuman } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { resolver } from '~/pages/admin/MasterPengumuman/Create/form'
import AdminMasterPengumumanEditPage from '~/pages/admin/MasterPengumuman/Edit'
import { AdminMasterPengumumanCreateFormType } from '~/pages/admin/MasterPengumuman/form-types'
import { ActionDataAdminMasterPengumumanEdit } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterPengumumanEdit } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterPengumuman
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterPengumumanEdit> {
  const pengumumanId = params.pengumumanId as Pengumuman['id'] | null
  const pengumuman = await prisma.pengumuman.findUnique({ where: { id: pengumumanId ?? '' } })

  return { pengumuman }
}

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataAdminMasterPengumumanEdit> {
  const { errors, data } = await getValidatedFormData<AdminMasterPengumumanCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const pengumumanId = params.pengumumanId as Pengumuman['id'] | null

    return await prisma.pengumuman
      .update({
        where: { id: pengumumanId ?? '' },
        data: {
          nama: data.nama,
          content: data.content,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Pengumuman berhasil diupdate!',
          data: {
            updatedPengumuman: result,
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

export default function AdminMasterPengumumanEditRoute() {
  return <AdminMasterPengumumanEditPage />
}
