import { Assignment, MataPelajaran } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { GuruManageMataPelajaranDetailAssignmentCreateFormType } from '~/pages/guru/ManageMataPelajaran/Detail/Assignment/form-types'
import { resolver } from '~/pages/guru/ManageMataPelajaran/Detail/Assignment/Create/form'
import { ActionDataGuruManageMataPelajaranDetailAssignmentEdit } from '~/types/actions-data/guru'
import { LoaderDataGuruManageMataPelajaranDetailAssignmentEdit } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import GuruManageMataPelajaranDetailAssignmentEditPage from '~/pages/guru/ManageMataPelajaran/Detail/Assignment/Edit'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageMataPelajaran
}
export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruManageMataPelajaranDetailAssignmentEdit> {
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null
  const assignmentId = params.assignmentId as Assignment['id'] | null

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

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId ?? '' },
  })

  return { mataPelajaran, assignment } as LoaderDataGuruManageMataPelajaranDetailAssignmentEdit
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataGuruManageMataPelajaranDetailAssignmentEdit> {
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

  const assignmentId = params.assignmentId as Assignment['id'] | null

  try {
    if (!assignmentId)
      throw {
        message: 'Assignment tidak ditemukan!',
      }

    return await prisma.assignment
      .update({
        where: { id: assignmentId },
        data: {
          title: data.title,
          description: data.description,
          tanggalMulai: new Date(data.tanggalMulai),
          tanggalBerakhir: new Date(data.tanggalBerakhir),
          isSubmitable: data.isSubmitable,
          submissionType: data.submissionType,
          mataPelajaranId: data.mataPelajaranId,
          updatedAt: new Date(),
          lastUpdateById: currUser?.id,
        },
      })
      .then(result => {
        return {
          success: true,
          message: 'Assignment berhasil update!',
          data: {
            updatedAssignment: result,
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

export default function GuruManageMataPelajaranDetailAssignmentEditRoute() {
  return <GuruManageMataPelajaranDetailAssignmentEditPage />
}
