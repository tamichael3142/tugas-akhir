import { MataPelajaran } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import GuruManageMataPelajaranDetailAssignmentCreatePage from '~/pages/guru/ManageMataPelajaran/Detail/Assignment/Create'
import { GuruManageMataPelajaranDetailAssignmentCreateFormType } from '~/pages/guru/ManageMataPelajaran/Detail/Assignment/form-types'
import { resolver } from '~/pages/guru/ManageMataPelajaran/Detail/Assignment/Create/form'
import { ActionDataGuruManageMataPelajaranDetailAssignmentCreate } from '~/types/actions-data/guru'
import { LoaderDataGuruManageMataPelajaranDetailAssignmentCreate } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageMataPelajaran
}
export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruManageMataPelajaranDetailAssignmentCreate> {
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null

  const mataPelajaran = await prisma.mataPelajaran.findUnique({
    where: { id: mataPelajaranId ?? '' },
    include: {
      semesterAjaran: {
        include: {
          tahunAjaran: true,
        },
      },
      guru: true,
    },
  })

  return { mataPelajaran } as LoaderDataGuruManageMataPelajaranDetailAssignmentCreate
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<ActionDataGuruManageMataPelajaranDetailAssignmentCreate> {
  const { errors, data } = await getValidatedFormData<GuruManageMataPelajaranDetailAssignmentCreateFormType>(
    request,
    resolver,
  )
  if (errors) {
    console.log(errors)
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    return await prisma.assignment
      .create({
        data: {
          title: data.title,
          description: data.description,
          tanggalMulai: new Date(data.tanggalMulai),
          tanggalBerakhir: new Date(data.tanggalBerakhir),
          isSubmitable: data.isSubmitable,
          submissionType: data.submissionType,
          mataPelajaranId: data.mataPelajaranId,
          createdById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Assignment berhasil dibuat!',
          data: {
            createdAssignment: result,
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

export default function GuruManageMataPelajaranDetailAssignmentCreateRoute() {
  return <GuruManageMataPelajaranDetailAssignmentCreatePage />
}
