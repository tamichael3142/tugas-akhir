import { Role } from '@prisma/client'
import { ActionFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import AdminMasterMataPelajaranCreatePage from '~/pages/admin/MasterMataPelajaran/Create'
import { AdminMasterMataPelajaranCreateFormType, resolver } from '~/pages/admin/MasterMataPelajaran/Create/form'
import { ActionDataAdminMasterMataPelajaranCreate } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterMataPelajaranCreate } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterMataPelajaran
}

export async function loader(): Promise<LoaderDataAdminMasterMataPelajaranCreate> {
  const tahunAjarans = await prisma.tahunAjaran.findMany({
    where: { deletedAt: null },
    orderBy: { nama: 'desc' },
    include: { semesterAjaran: true },
  })
  const gurus = await prisma.akun.findMany({
    where: { role: Role.GURU, deletedAt: null },
    orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
  })

  return {
    tahunAjarans,
    gurus,
  }
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataAdminMasterMataPelajaranCreate> {
  const { errors, data } = await getValidatedFormData<AdminMasterMataPelajaranCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    return await prisma.mataPelajaran
      .create({
        data: {
          nama: data.nama,
          semesterAjaranId: data.semesterAjaranId ?? '',
          // eslint-disable-next-line no-extra-boolean-cast
          guruId: !!data.guruId ? data.guruId : null,
          createdById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Mata pelajaran berhasil dibuat!',
          data: {
            createdMataPelajaran: result,
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

export default function AdminMasterMataPelajaranCreateRoute() {
  return <AdminMasterMataPelajaranCreatePage />
}
