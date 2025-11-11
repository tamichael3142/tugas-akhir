import { Role } from '@prisma/client'
import { ActionFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import AdminMasterEkstrakulikulerCreatePage from '~/pages/admin/MasterEkstrakulikuler/Create'
import { AdminMasterEkstrakulikulerCreateFormType, resolver } from '~/pages/admin/MasterEkstrakulikuler/Create/form'
import { ActionDataAdminMasterEkstrakulikulerCreate } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterEkstrakulikulerCreate } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterEkstrakulikuler
}

export async function loader(): Promise<LoaderDataAdminMasterEkstrakulikulerCreate> {
  const tahunAjarans = await prisma.tahunAjaran.findMany({ where: { deletedAt: null }, orderBy: { nama: 'desc' } })
  const pengajars = await prisma.akun.findMany({
    where: { role: Role.GURU, deletedAt: null },
    orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
  })

  return {
    tahunAjarans,
    pengajars,
  }
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataAdminMasterEkstrakulikulerCreate> {
  const { errors, data } = await getValidatedFormData<AdminMasterEkstrakulikulerCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    return await prisma.ekstrakulikuler
      .create({
        data: {
          nama: data.nama,
          tahunAjaranId: data.tahunAjaranId ?? '',
          ruangan: data.ruangan,
          // eslint-disable-next-line no-extra-boolean-cast
          pengajarId: !!data.pengajarId ? data.pengajarId : null,
          createdById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Ekstrakulikuler berhasil dibuat!',
          data: {
            createdEkstrakulikuler: result,
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

export default function AdminMasterEkstrakulikulerCreateRoute() {
  return <AdminMasterEkstrakulikulerCreatePage />
}
