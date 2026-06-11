import { Ekstrakulikuler, Role } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import AdminMasterEkstrakulikulerAddSiswaPage from '~/pages/admin/MasterEkstrakulikuler/AddSiswa'
import { AdminMasterEkstrakulikulerAddSiswaFormType, resolver } from '~/pages/admin/MasterEkstrakulikuler/AddSiswa/form'
import { ActionDataAdminMasterEkstrakulikulerAddSiswa } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterEkstrakulikulerAddSiswa } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterEkstrakulikulerAddSiswa
}

export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataAdminMasterEkstrakulikulerAddSiswa> {
  const ekstrakulikulerId = params.ekstrakulikulerId as Ekstrakulikuler['id'] | null

  const ekstrakulikuler = await prisma.ekstrakulikuler.findUnique({
    where: { id: ekstrakulikulerId ?? '' },
    include: {
      tahunAjaran: true,
      pengajar: true,
    },
  })

  const existingSiswaPerEkstrakulikulers = await prisma.siswaPerEkstrakulikuler.findMany({
    where: {
      ekstrakulikulerId: ekstrakulikulerId ?? '',
    },
  })

  const availableSiswas = await getPaginatedData({
    request,
    model: prisma.akun,
    options: {
      defaultLimit: 50,
      where: {
        role: Role.SISWA,
        deletedAt: null,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            { username: { contains: search, mode: 'insensitive' } },
            { nip: { contains: search, mode: 'insensitive' } },
            { displayName: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ]
        }

        return where
      },
      orderBy: [{ createdAt: 'desc' }],
    },
  })

  return {
    ekstrakulikuler,
    existingSiswaPerEkstrakulikulers,
    availableSiswas,
  } as LoaderDataAdminMasterEkstrakulikulerAddSiswa
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataAdminMasterEkstrakulikulerAddSiswa> {
  const { errors, data } = await getValidatedFormData<AdminMasterEkstrakulikulerAddSiswaFormType>(request, resolver)
  if (errors) {
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const ekstrakulikulerId = params.ekstrakulikulerId as Ekstrakulikuler['id'] | null
    if (!ekstrakulikulerId)
      throw {
        code: 401,
        message: 'Extracurricular not found!',
      }

    return await prisma
      .$transaction(async tx => {
        const existing = await tx.siswaPerEkstrakulikuler.findMany({
          where: { ekstrakulikulerId },
        })

        // Hapus data yang ada di DB tapi di form tidak ada
        for (const row of existing) {
          if (!data.siswaIds.includes(row.siswaId)) {
            await tx.siswaPerEkstrakulikuler.delete({ where: { id: row.id } })
          }
        }

        // Create data yang belum ada
        for (const siswaId of data.siswaIds) {
          const exists = existing.find(e => e.siswaId === siswaId)
          if (!exists) {
            await tx.siswaPerEkstrakulikuler.create({
              data: { ekstrakulikulerId, siswaId },
            })
          }
        }

        await tx.ekstrakulikuler.update({
          where: { id: ekstrakulikulerId },
          data: { lastUpdateById: currUser?.id, updatedAt: new Date() },
        })
      })
      .then(() => {
        return {
          success: true,
          message: 'Student of this extracurricular updated!',
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

export default function AdminMasterEkstrakulikulerAddSiswaRoute() {
  return <AdminMasterEkstrakulikulerAddSiswaPage />
}
