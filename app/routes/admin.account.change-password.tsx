import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import DBHelpers from '~/database/helpers'
import akunProfileStorageManager from '~/storage-manager/akunProfile.storageManager.server'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getValidatedFormData } from 'remix-hook-form'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import PasswordUtils from '~/utils/password.utils'
import { LoaderDataAdminAccountChangePassword } from '~/types/loaders-data/admin'
import { ActionDataAdminAccountChangePassword } from '~/types/actions-data/admin'
import { AdminAccountChangePasswordFormType, resolver } from '~/pages/admin/Account/ChangePassword/form'
import AdminAccountChangePasswordPage from '~/pages/admin/Account/ChangePassword'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminAccount
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataAdminAccountChangePassword> {
  const userId = await requireAuthCookie(request)

  const storageManager = akunProfileStorageManager()

  const account = await prisma.akun.findUnique({ where: { id: userId } })

  let currentTahunAjaran = await prisma.tahunAjaran.findFirst({
    where: {
      tahunMulai: { lte: new Date() },
      tahunBerakhir: { gte: new Date() },
    },
    include: { semesterAjaran: true },
  })

  if (!currentTahunAjaran)
    currentTahunAjaran = await prisma.tahunAjaran.findFirst({
      include: { semesterAjaran: true },
      orderBy: { createdAt: 'desc' },
    })

  const currentSemesterUrutan = DBHelpers.semesterAjaran.getTodaySemesterAjaranUrutan()
  const currentSemester = DBHelpers.semesterAjaran.getCurrentSemesterAjaranFromTahunAjaran({
    currentSemesterUrutan,
    semesterAjaran: currentTahunAjaran?.semesterAjaran ?? [],
  })

  return {
    currentTahunAjaran,
    currentSemester,
    account: {
      ...account,
      profileImageObjectUrl: account?.profileImageObjectPath
        ? await storageManager.getDownloadUrl({ fullPath: account.profileImageObjectPath })
        : undefined,
    },
  } as LoaderDataAdminAccountChangePassword
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataAdminAccountChangePassword> {
  const { errors, data } = await getValidatedFormData<AdminAccountChangePasswordFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    if (data.password !== data.passwordVerification)
      throw {
        message: 'Verifikasi password tidak sama!',
      }

    return await prisma.akun
      .update({
        where: { id: userId ?? '' },
        data: {
          password: await PasswordUtils.hashPassword(data.password),
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(() => {
        return {
          success: true,
          message: 'Password akun berhasil diupdate!',
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

export default function AdminAccountDetailChangePasswordRoute() {
  return <AdminAccountChangePasswordPage />
}
