import { Pengumuman } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { resolver } from '~/pages/guru/MasterPengumuman/Create/form'
import GuruMasterPengumumanEditPage from '~/pages/guru/MasterPengumuman/Edit'
import { GuruMasterPengumumanCreateFormType } from '~/pages/guru/MasterPengumuman/form-types'
import { ActionDataGuruMasterPengumumanEdit } from '~/types/actions-data/guru'
import { LoaderDataGuruMasterPengumumanEdit } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruMasterPengumuman
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataGuruMasterPengumumanEdit> {
  const pengumumanId = params.pengumumanId as Pengumuman['id'] | null
  const pengumuman = await prisma.pengumuman.findUnique({ where: { id: pengumumanId ?? '' } })

  return { pengumuman }
}

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionDataGuruMasterPengumumanEdit> {
  const { errors, data } = await getValidatedFormData<GuruMasterPengumumanCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const pengumumanId = params.pengumumanId as Pengumuman['id'] | null

    return await prisma.pengumuman
      .update({
        where: { id: pengumumanId ?? '' },
        data: {
          nama: data.nama,
          content: data.content,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Pengumuman berhasil diupdate!',
          data: {
            updatedPengumuman: result,
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

export default function GuruMasterPengumumanEditRoute() {
  return <GuruMasterPengumumanEditPage />
}
