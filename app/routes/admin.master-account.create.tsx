import { ActionFunctionArgs } from '@remix-run/node'
import { getValidatedFormData } from 'remix-hook-form'
import DBHelpers from '~/database/helpers'
import AdminMasterAccountCreatePage from '~/pages/admin/MasterAccount/Create'
import { AdminMasterAccountInsertAkunFormType, resolver } from '~/pages/admin/MasterAccount/Create/form'
import { ActionDataAdminMasterAccountCreate } from '~/types/actions-data/admin'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataAdminMasterAccountCreate> {
  const { errors, data } = await getValidatedFormData<AdminMasterAccountInsertAkunFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  // TODO: ganti ini nanti pake auth
  const currUser = await prisma.akun.findUnique({ where: { username: 'superadmin' } })

  try {
    let newUsername = data.username
    const existData = await prisma.akun.findFirst({
      where: { username: { startsWith: newUsername } },
      orderBy: { createdAt: 'desc' },
    })

    if (existData) newUsername = DBHelpers.akun.uniqifyExistingUsername(existData.username)

    return await prisma.akun
      .create({
        data: {
          ...data,
          username: newUsername,
          tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : null,
          createdById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Akun berhasil dibuat!',
          data: {
            createdAkun: result,
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

export default function AdminMasterAccountCreateRoute() {
  return <AdminMasterAccountCreatePage />
}
