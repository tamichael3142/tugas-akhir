import { ActionFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { GuruMasterPengumumanCreateFormType, resolver } from '~/pages/guru/MasterPengumuman/Create/form'
import { ActionDataGuruMasterPengumumanCreate } from '~/types/actions-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import GuruMasterPengumumanCreatePage from '~/pages/guru/MasterPengumuman/Create'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruMasterPengumuman
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataGuruMasterPengumumanCreate> {
  const { errors, data } = await getValidatedFormData<GuruMasterPengumumanCreateFormType>(request, resolver)
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

export default function GuruMasterPengumumanCreateRoute() {
  return <GuruMasterPengumumanCreatePage />
}
