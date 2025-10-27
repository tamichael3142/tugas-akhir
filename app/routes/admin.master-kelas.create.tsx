import { ActionFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import AdminMasterKelasCreatePage from '~/pages/admin/MasterKelas/Create'
import { AdminMasterKelasCreateFormType, resolver } from '~/pages/admin/MasterKelas/Create/form'
import { ActionDataAdminMasterKelasCreate } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterKelasCreate } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterKelas
}

export async function loader(): Promise<LoaderDataAdminMasterKelasCreate> {
  const tahunAjarans = await prisma.tahunAjaran.findMany({ where: { deletedAt: null } })

  return {
    tahunAjarans,
  }
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataAdminMasterKelasCreate> {
  const { errors, data } = await getValidatedFormData<AdminMasterKelasCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    return await prisma.kelas
      .create({
        data: {
          nama: data.nama,
          tahunAjaranId: data.tahunAjaranId ?? '',
          createdById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Kelas berhasil dibuat!',
          data: {
            createdKelas: result,
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

export default function AdminMasterKelasCreateRoute() {
  return <AdminMasterKelasCreatePage />
}
