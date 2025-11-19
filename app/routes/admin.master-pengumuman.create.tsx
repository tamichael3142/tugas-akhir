import { ActionFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { AdminMasterPengumumanCreateFormType, resolver } from '~/pages/admin/MasterPengumuman/Create/form'
import { ActionDataAdminMasterPengumumanCreate } from '~/types/actions-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import AdminMasterPengumumanCreatePage from '~/pages/admin/MasterPengumuman/Create'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterPengumuman
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataAdminMasterPengumumanCreate> {
  const { errors, data } = await getValidatedFormData<AdminMasterPengumumanCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    return await prisma.pengumuman
      .create({
        data: {
          ...data,
          createdById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Pengumuman berhasil dibuat!',
          data: {
            createdPengumuman: result,
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

export default function AdminMasterPengumumanCreateRoute() {
  return <AdminMasterPengumumanCreatePage />
}
