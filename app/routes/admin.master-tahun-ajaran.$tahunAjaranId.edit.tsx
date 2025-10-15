import { Akun, TahunAjaran } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { resolver } from '~/pages/admin/MasterTahunAjaran/Create/form'
import AdminMasterTahunAjaranEditPage from '~/pages/admin/MasterTahunAjaran/Edit'
import { AdminMasterTahunAjaranCreateFormType } from '~/pages/admin/MasterTahunAjaran/form-types'
import { ActionDataAdminMasterTahunAjaranEdit } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterTahunAjaranEdit } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterTahunAjaran
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterTahunAjaranEdit> {
  const tahunAjaranId = params.tahunAjaranId as Akun['id'] | null
  const tahunAjaran = await prisma.tahunAjaran.findUnique({ where: { id: tahunAjaranId ?? '' } })

  return { tahunAjaran }
}

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataAdminMasterTahunAjaranEdit> {
  const { errors, data } = await getValidatedFormData<AdminMasterTahunAjaranCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const tahunAjaranId = params.tahunAjaranId as TahunAjaran['id'] | null

    return await prisma.tahunAjaran
      .update({
        where: { id: tahunAjaranId ?? '' },
        data: {
          nama: data.nama,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Tahun ajaran berhasil diupdate!',
          data: {
            updatedTahunAjaran: result,
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

export default function AdminMasterAccountEditRoute() {
  return <AdminMasterTahunAjaranEditPage />
}
