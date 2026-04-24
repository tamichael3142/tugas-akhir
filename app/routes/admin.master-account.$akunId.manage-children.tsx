import { Akun, Role } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import AdminMasterAccountManageChildrenPage from '~/pages/admin/MasterAccount/ManageChildren'
import { AdminMasterAccountManageChildrenFormType, resolver } from '~/pages/admin/MasterAccount/ManageChildren/form'
import { ActionDataAdminMasterAccountSaveChildren } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterAkunManageChildren } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterAccountManageChildren
}

export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataAdminMasterAkunManageChildren> {
  const parentId = params.akunId as Akun['id'] | null

  const ortuNow = await prisma.akun.findUnique({
    where: { id: parentId ?? '' },
    include: {
      children: {
        include: { siswa: true },
      },
    },
  })

  const children: Akun[] = []

  ortuNow?.children.forEach(item => children.push(item.siswa))

  const akuns = await getPaginatedData({
    request,
    model: prisma.akun,
    options: {
      defaultLimit: 10,
      where: {
        deletedAt: null,
        role: Role.SISWA,
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
      orderBy: [{ createdAt: 'desc' }, { tanggalLahir: 'asc' }],
    },
  })

  return {
    children,
    akuns,
  }
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataAdminMasterAccountSaveChildren> {
  const { errors, data } = await getValidatedFormData<AdminMasterAccountManageChildrenFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const parentId = params.akunId as Akun['id'] | null

  try {
    if (!parentId)
      throw {
        message: 'Akun parent tidak ada!',
      }

    return await prisma
      .$transaction(async tx => {
        // 1. delete relasi yang tidak ada di list baru
        await tx.akunChildren.deleteMany({
          where: {
            parentId: parentId,
            siswaId: {
              notIn: data.childrenIds,
            },
          },
        })

        // 2. insert yang belum ada
        await tx.akunChildren.createMany({
          data: data.childrenIds.map(siswaId => ({
            parentId: parentId,
            siswaId,
          })),
          skipDuplicates: true,
        })

        // 3. update parent account
        await tx.akun.update({
          where: { id: parentId },
          data: {
            updatedAt: new Date(),
            lastUpdateById: userId,
          },
        })
      })

      .then(() => {
        return {
          success: true,
          message: 'List anak berhasil di-update!',
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

export default function AdminMasterAccountManageChildrenRoute() {
  return <AdminMasterAccountManageChildrenPage />
}
