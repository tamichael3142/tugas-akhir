import { Absensi } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import GuruManageAbsensiEditPage from '~/pages/guru/ManageAbsensi/Edit'
import { GuruManageAbsensiEditFormType } from '~/pages/guru/ManageAbsensi/form-types'
import { resolver } from '~/pages/guru/ManageAbsensi/Edit/form'
import { ActionDataGuruManageAbsensiEdit } from '~/types/actions-data/guru'
import { LoaderDataGuruManageAbsensiEdit } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageAbsensi
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataGuruManageAbsensiEdit> {
  const absensiId = params.absensiId as Absensi['id'] | null
  const absensi = await prisma.absensi.findUnique({
    where: { id: absensiId ?? '' },
    include: {
      kelas: {
        include: {
          tahunAjaran: {
            include: {
              semesterAjaran: true,
            },
          },
        },
      },
    },
  })

  return { absensi } as LoaderDataGuruManageAbsensiEdit
}

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataGuruManageAbsensiEdit> {
  const { errors, data } = await getValidatedFormData<GuruManageAbsensiEditFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const absensiId = params.absensiId as Absensi['id'] | null

    return await prisma.absensi
      .update({
        where: { id: absensiId ?? '' },
        data: {
          label: data.label,
          remarks: data.remarks,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Absensi berhasil diupdate!',
          data: {
            updatedAbsensi: result,
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

export default function GuruManageAbsensiEditRoute() {
  return <GuruManageAbsensiEditPage />
}
