import { Ekstrakulikuler, Role } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { resolver } from '~/pages/admin/MasterEkstrakulikuler/Create/form'
import AdminMasterEkstrakulikulerEditPage from '~/pages/admin/MasterEkstrakulikuler/Edit'
import { AdminMasterEkstrakulikulerCreateFormType } from '~/pages/admin/MasterEkstrakulikuler/form-types'
import { ActionDataAdminMasterEkstrakulikulerEdit } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterEkstrakulikulerEdit } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterEkstrakulikuler
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterEkstrakulikulerEdit> {
  const ekstrakulikulerId = params.ekstrakulikulerId as Ekstrakulikuler['id'] | null
  const ekstrakulikuler = await prisma.ekstrakulikuler.findUnique({
    where: { id: ekstrakulikulerId ?? '' },
    include: { tahunAjaran: true, pengajar: true },
  })

  const tahunAjarans = await prisma.tahunAjaran.findMany({ where: { deletedAt: null } })
  const pengajars = await prisma.akun.findMany({
    where: { role: Role.GURU, deletedAt: null },
    orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
  })

  return { ekstrakulikuler, tahunAjarans, pengajars }
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataAdminMasterEkstrakulikulerEdit> {
  const { errors, data } = await getValidatedFormData<AdminMasterEkstrakulikulerCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const ekstrakulikulerId = params.ekstrakulikulerId as Ekstrakulikuler['id'] | null

    return await prisma.ekstrakulikuler
      .update({
        where: { id: ekstrakulikulerId ?? '' },
        data: {
          nama: data.nama,
          ruangan: data.ruangan ?? null,
          tahunAjaranId: data.tahunAjaranId ?? '',
          // eslint-disable-next-line no-extra-boolean-cast
          pengajarId: !!data.pengajarId ? data.pengajarId : null,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Ekstrakulikuler berhasil diupdate!',
          data: {
            updatedEkstrakulikuler: result,
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

export default function AdminMasterEkstrakulikulerEditRoute() {
  return <AdminMasterEkstrakulikulerEditPage />
}
