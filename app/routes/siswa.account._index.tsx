import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import DBHelpers from '~/database/helpers'
import SiswaAccountPage from '~/pages/siswa/Account'
import akunProfileStorageManager from '~/storage-manager/akunProfile.storageManager.server'
import { ActionDataSiswaAccountSelfUpdate } from '~/types/actions-data/siswa'
import { LoaderDataSiswaAccount } from '~/types/loaders-data/siswa'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { resolver, SiswaAccountSelfUpdateFormType } from '~/pages/siswa/Account/form'
import { getValidatedFormData } from 'remix-hook-form'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaPelanggaran
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataSiswaAccount> {
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
  } as LoaderDataSiswaAccount
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataSiswaAccountSelfUpdate> {
  const { errors, data } = await getValidatedFormData<SiswaAccountSelfUpdateFormType>(request, resolver)
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

export default function SiswaDaftarAccountRoute() {
  return <SiswaAccountPage />
}
