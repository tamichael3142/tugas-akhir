import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import DBHelpers from '~/database/helpers'
import akunProfileStorageManager from '~/storage-manager/akunProfile.storageManager.server'
import { ActionDataSiswaAccountChangePassword } from '~/types/actions-data/siswa'
import { LoaderDataSiswaAccountChangePassword } from '~/types/loaders-data/siswa'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getValidatedFormData } from 'remix-hook-form'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import { SiswaAccountChangePasswordFormType, resolver } from '~/pages/siswa/Account/ChangePassword/form'
import PasswordUtils from '~/utils/password.utils'
import SiswaAccountChangePasswordPage from '~/pages/siswa/Account/ChangePassword'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaAccount
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataSiswaAccountChangePassword> {
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
  } as LoaderDataSiswaAccountChangePassword
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataSiswaAccountChangePassword> {
  const { errors, data } = await getValidatedFormData<SiswaAccountChangePasswordFormType>(request, resolver)
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

export default function SiswaDaftarAccountChangePasswordRoute() {
  return <SiswaAccountChangePasswordPage />
}
