import { Ekstrakulikuler } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import AdminMasterEkstrakulikulerManageSiswaPage from '~/pages/admin/MasterEkstrakulikuler/ManageSiswa'
import { LoaderDataAdminMasterEkstrakulikulerManageSiswa } from '~/types/loaders-data/admin'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'
import {
  AdminMasterEkstrakulikulerDeleteSiswaFormType,
  resolver,
} from '~/pages/admin/MasterEkstrakulikuler/ManageSiswa/form'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterEkstrakulikulerManageSiswa
}

export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataAdminMasterEkstrakulikulerManageSiswa> {
  const ekstrakulikulerId = params.ekstrakulikulerId as Ekstrakulikuler['id'] | null

  const ekstrakulikuler = await prisma.ekstrakulikuler.findUnique({
    where: { id: ekstrakulikulerId ?? '' },
    include: {
      tahunAjaran: true,
      pengajar: true,
    },
  })

  const siswaPerEkstrakulikulers = await getPaginatedData({
    request,
    model: prisma.siswaPerEkstrakulikuler,
    options: {
      defaultLimit: 50,
      include: {
        siswa: true,
      },
      where: {
        ekstrakulikulerId: ekstrakulikulerId,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            { siswa: { is: { username: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { nip: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { displayName: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { firstName: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { lastName: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { email: { contains: search, mode: 'insensitive' } } } },
          ]
        }

        return where
      },
      orderBy: [{ siswa: { createdAt: 'desc' } }],
    },
  })

  return {
    ekstrakulikuler,
    siswaPerEkstrakulikulers,
  } as LoaderDataAdminMasterEkstrakulikulerManageSiswa
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { errors, data } = await getValidatedFormData<AdminMasterEkstrakulikulerDeleteSiswaFormType>(request, resolver)
  if (errors) {
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  await requireAuthCookie(request)

  try {
    const ekstrakulikulerId = params.ekstrakulikulerId as Ekstrakulikuler['id'] | null

    return await prisma.siswaPerEkstrakulikuler
      .deleteMany({
        where: {
          id: { in: data.siswaPerEkstrakulikulerIds },
          ekstrakulikulerId: ekstrakulikulerId ?? '',
        },
      })
      .then(() => {
        return {
          success: true,
          message: 'Student removed from the list!',
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
      data: {},
    }
  }
}

export default function AdminMasterEkstrakulikulerManageSiswaRoute() {
  return <AdminMasterEkstrakulikulerManageSiswaPage />
}
