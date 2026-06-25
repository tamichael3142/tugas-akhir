import { Ekstrakulikuler } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import DBUtils from '~/database/utils'
import GuruManageEkstrakulikulerDetailAssessmentPage from '~/pages/guru/ManageEkstrakulikuler/Detail/Assessment'
import {
  GuruManageEkstrakulikulerDetailAssessmentFormType,
  resolver,
} from '~/pages/guru/ManageEkstrakulikuler/Detail/Assessment/form'
import { ActionDataGuruManageEkstrakulikulerDetailAssessment } from '~/types/actions-data/guru'
import { LoaderDataGuruManageEkstrakulikulerDetailAssessment } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageEkstrakulikuler
}

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruManageEkstrakulikulerDetailAssessment> {
  const ekstrakulikulerId = params.ekstrakulikulerId as Ekstrakulikuler['id'] | null

  const ekstrakulikuler = await prisma.ekstrakulikuler.findUnique({
    where: { id: ekstrakulikulerId ?? '' },
    include: {
      tahunAjaran: true,
      pengajar: true,
    },
  })

  const kompetensiEkstrakulikulers = await prisma.kompetensiEkstrakulikuler.findMany({
    where: { deletedAt: null },
    orderBy: { sequenceNumber: 'asc' },
  })

  const siswaPerEkstrakulikulers = await prisma.siswaPerEkstrakulikuler.findMany({
    where: { ekstrakulikulerId: ekstrakulikulerId ?? undefined },
    include: { siswa: true },
  })

  const penilaianEkstrakulikulers = await prisma.penilaianExtrakulikuler.findMany({
    where: { ekstrakulikulerId: ekstrakulikulerId ?? undefined },
  })

  return {
    ekstrakulikuler,
    kompetensiEkstrakulikulers,
    siswaPerEkstrakulikulers,
    penilaianEkstrakulikulers: [
      ...penilaianEkstrakulikulers.map(item => ({
        ...item,
        nilai: DBUtils.decimal.decimalToNumber(item.nilai),
      })),
    ],
  } as LoaderDataGuruManageEkstrakulikulerDetailAssessment
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionDataGuruManageEkstrakulikulerDetailAssessment> {
  const { errors, data } = await getValidatedFormData<GuruManageEkstrakulikulerDetailAssessmentFormType>(
    request,
    resolver,
  )
  if (errors) {
    return { success: false, error: errors, data: { oldFormData: data } }
  }

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  try {
    const ekstrakulikulerId = params.ekstrakulikulerId as Ekstrakulikuler['id'] | null

    if (!currUser)
      throw {
        code: 404,
        message: 'User not found!',
      }

    if (!ekstrakulikulerId)
      throw {
        code: 404,
        message: 'Extracurricular not found!',
      }

    return await prisma
      .$transaction(async tx => {
        for (const row of data.penilaians) {
          // 1. DELETE jika nilai tidak ada valuenya & id ada
          if (!row.nilai && row.id) {
            await tx.penilaianExtrakulikuler.delete({
              where: { id: row.id },
            })
            continue
          }

          // 2. SKIP jika nilai tidak ada valuenya & id null
          if (!row.ekstrakulikulerId && !row.id) {
            continue
          }

          // 3. UPDATE jika id ada
          if (row.id) {
            await tx.penilaianExtrakulikuler.update({
              where: { id: row.id },
              data: {
                ekstrakulikulerId: ekstrakulikulerId,
                kompetensiEkstrakulikulerId: row.kompetensiEkstrakulikulerId,
                siswaId: row.siswaId,
                nilai: row.nilai,
                updatedAt: new Date(),
              },
            })
            continue
          }

          // 4. CREATE jika id null & nilai ada valuenya
          await tx.penilaianExtrakulikuler.create({
            data: {
              ekstrakulikulerId: ekstrakulikulerId,
              kompetensiEkstrakulikulerId: row.kompetensiEkstrakulikulerId,
              siswaId: row.siswaId,
              nilai: row.nilai,
              createdAt: new Date(),
            },
          })
        }
      })
      .then(() => {
        return {
          success: true,
          message: 'Scoring updated!',
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

export default function GuruManageEkstrakulikulerDetailAssessmentRoute() {
  return <GuruManageEkstrakulikulerDetailAssessmentPage />
}
