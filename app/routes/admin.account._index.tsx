import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import akunProfileStorageManager from '~/storage-manager/akunProfile.storageManager.server'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getValidatedFormData } from 'remix-hook-form'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import { LoaderDataAdminAccount } from '~/types/loaders-data/admin'
import { ActionDataAdminAccountSelfUpdate } from '~/types/actions-data/admin'
import { AdminAccountSelfUpdateFormType, resolver } from '~/pages/admin/Account/form'
import AdminAccountPage from '~/pages/admin/Account'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminAccount
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataAdminAccount> {
  const userId = await requireAuthCookie(request)

  const storageManager = akunProfileStorageManager()

  const account = await prisma.akun.findUnique({ where: { id: userId } })

  return {
    account: {
      ...account,
      profileImageObjectUrl: account?.profileImageObjectPath
        ? await storageManager.getDownloadUrl({ fullPath: account.profileImageObjectPath })
        : undefined,
    },
  } as LoaderDataAdminAccount
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataAdminAccountSelfUpdate> {
  const { errors, data } = await getValidatedFormData<AdminAccountSelfUpdateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    return await prisma.akun
      .update({
        where: { id: userId ?? '' },
        data: {
          email: data.email,
          tempatLahir: data.tempatLahir,
          alamat: data.alamat,
          agama: data.agama,
          golonganDarah: data.golonganDarah,
          kewarganegaraan: data.kewarganegaraan,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(() => {
        return {
          success: true,
          message: 'Akun berhasil diupdate!',
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

export default function AdminAccountDetailRoute() {
  return <AdminAccountPage />
}
