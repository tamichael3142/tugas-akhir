import { Kelas, MataPelajaran } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import { GuruDaftarKelasDetailMataPelajaranDetailAssignmentCreateFormType } from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Assignment/form-types'
import { resolver } from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Assignment/Create/form'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentCreate } from '~/types/actions-data/guru'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentCreate } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'
import GuruDaftarKelasDetailMataPelajaranDetailAssignmentCreatePage from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Assignment/Create'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageMataPelajaran
}
export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentCreate> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId ?? '' },
    include: {
      tahunAjaran: {
        include: {
          semesterAjaran: true,
        },
      },
      wali: true,
    },
  })

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

  return { kelas, mataPelajaran } as LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentCreate
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentCreate> {
  const { errors, data } = await getValidatedFormData<GuruDaftarKelasDetailMataPelajaranDetailAssignmentCreateFormType>(
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
    const kelasId = params.kelasId as Kelas['id'] | null
    const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null

    console.log('mataPelajaranId', mataPelajaranId)

    return await prisma.assignment
      .create({
        data: {
          mataPelajaranId: mataPelajaranId ?? '',
          kelasId: kelasId ?? '',
          title: data.title,
          description: data.description,
          tanggalMulai: new Date(data.tanggalMulai),
          tanggalBerakhir: new Date(data.tanggalBerakhir),
          isSubmitable: data.isSubmitable,
          submissionType: data.submissionType,
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

export default function GuruDaftarKelasDetailMataPelajaranDetailAssignmentCreateRoute() {
  return <GuruDaftarKelasDetailMataPelajaranDetailAssignmentCreatePage />
}
