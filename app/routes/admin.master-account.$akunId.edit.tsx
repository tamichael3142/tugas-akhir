import { Akun } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { resolver } from '~/pages/admin/MasterAccount/Create/form'
import AdminMasterAccountEditPage from '~/pages/admin/MasterAccount/Edit'
import { AdminMasterAccountInsertAkunFormType } from '~/pages/admin/MasterAccount/form-types'
import { ActionDataAdminMasterAccountEdit } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterAkunEdit } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterAccount
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterAkunEdit> {
  const akunId = params.akunId as Akun['id'] | null
  const akun = await prisma.akun.findUnique({ where: { id: akunId ?? '' } })

  return { akun }
}

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataAdminMasterAccountEdit> {
  const { errors, data } = await getValidatedFormData<AdminMasterAccountInsertAkunFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const akunId = params.akunId as Akun['id'] | null

    return await prisma.akun
      .update({
        where: { id: akunId ?? '' },
        data: {
          role: data.role,
          nip: data.nip,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          tempatLahir: data.tempatLahir,
          tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : null,
          jenisKelamin: data.jenisKelamin,
          alamat: data.alamat,
          agama: data.agama,
          golonganDarah: data.golonganDarah,
          kewarganegaraan: data.kewarganegaraan,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Akun berhasil diupdate!',
          data: {
            updatedAkun: result,
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
  return <AdminMasterAccountEditPage />
}
