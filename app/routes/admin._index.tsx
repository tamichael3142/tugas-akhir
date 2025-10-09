import { ActionFunctionArgs } from '@remix-run/node'
import { getValidatedFormData } from 'remix-hook-form'
import AdminIndexPage from '~/pages/admin/Dashboard'
import { AdminDashboardInsertBulkAkunFormType, resolver } from '~/pages/admin/Dashboard/form'
import { ActionDataAdminIndex } from '~/types/actions-data/admin'
import { LoaderDataAdminIndex } from '~/types/loaders-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import PasswordUtils from '~/utils/password.utils'

export async function loader() {
  const tempAkuns = await prisma.tempAkun.findMany().catch(error => {
    console.log(error)
    return []
  })
  const response: LoaderDataAdminIndex = { tempAkuns }

  return response
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataAdminIndex> {
  const { errors, data } = await getValidatedFormData<AdminDashboardInsertBulkAkunFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  const deletingIds = [...data.deletedTempAkunIds]
  data.newUsers.forEach(item => {
    if (item.tempAkunId) deletingIds.push(item.tempAkunId)
  })

  const creatingAkuns = []
  for (let i = 0; i < data.newUsers.length; i++) {
    const item = data.newUsers[i]
    creatingAkuns.push({
      firstName: item.firstName,
      lastName: item.lastName,
      tempatLahir: item.tempatLahir,
      tanggalLahir: item.tanggalLahir ? new Date(item.tanggalLahir) : undefined,
      role: item.role,
      username: item.username,
      password: await PasswordUtils.hashPassword(item.password),
      email: item.email,
      jenisKelamin: item.jenisKelamin,
      agama: item.agama,
      alamat: item.alamat,
      golonganDarah: item.golonganDarah,
      kewarganegaraan: item.kewarganegaraan,
      createdById: currUser?.id,
      lastUpdateById: currUser?.id,
    })
  }

  try {
    const results = await prisma.$transaction([
      prisma.akun.createManyAndReturn({
        data: creatingAkuns,
      }),
      prisma.tempAkun.deleteMany({ where: { id: { in: deletingIds } } }),
    ])

    return {
      success: true,
      message: 'Akun berhasil dibuat!',
      data: {
        deletedCount: results[1].count,
        createdAkuns: results[0],
      },
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error,
      message: 'Akun gagal dibuat!',
      data: {
        oldFormData: data,
      },
    }
  }
}

export default function AdminIndexRoute() {
  return <AdminIndexPage />
}
