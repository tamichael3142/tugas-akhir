import { SemesterAjaranUrutan } from '@prisma/client'
import { ActionFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import AdminMasterTahunAjaranCreatePage from '~/pages/admin/MasterTahunAjaran/Create'
import { AdminMasterTahunAjaranCreateFormType, resolver } from '~/pages/admin/MasterTahunAjaran/Create/form'
import { ActionDataAdminMasterTahunAjaranCreate } from '~/types/actions-data/admin'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterTahunAjaran
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataAdminMasterTahunAjaranCreate> {
  const { errors, data } = await getValidatedFormData<AdminMasterTahunAjaranCreateFormType>(request, resolver)
  if (errors) {
    console.log(errors)
    return { success: false, message: JSON.stringify(errors), error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const tahunMulaiDate = new Date(data.tahunMulai)
    const tepatTahunMulai = new Date(Date.UTC(tahunMulaiDate.getFullYear(), 5, 1, 0, 0, 0, 0))
    const tahunBerakhirDate = new Date(data.tahunBerakhir)
    const tepatTahunBerakhir = new Date(Date.UTC(tahunBerakhirDate.getFullYear(), 5, 1, 0, 0, 0, 0))

    const existingTahunAjaran = await prisma.tahunAjaran.findFirst({
      where: { tahunMulai: tepatTahunMulai, tahunBerakhir: tepatTahunBerakhir },
    })

    if (existingTahunAjaran) {
      throw {
        message: 'Tahun ajaran sudah pernah dibuat.',
      }
    }

    return await prisma.tahunAjaran
      .create({
        data: {
          ...data,
          tahunMulai: tepatTahunMulai,
          tahunBerakhir: tepatTahunBerakhir,
          createdById: currUser?.id,
          semesterAjaran: {
            create: [
              { urutan: SemesterAjaranUrutan.SATU, createdById: currUser?.id },
              { urutan: SemesterAjaranUrutan.DUA, createdById: currUser?.id },
            ],
          },
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Tahun ajaran berhasil dibuat!',
          data: {
            createdTahunAjaran: result,
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

export default function AdminMasterTahunAjaranCreateRoute() {
  return <AdminMasterTahunAjaranCreatePage />
}
