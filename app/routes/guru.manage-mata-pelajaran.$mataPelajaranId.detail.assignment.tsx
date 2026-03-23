import { Kelas } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruManageMataPelajaranDetailAssignmentPage from '~/pages/guru/ManageMataPelajaran/Detail/Assignment'
import { LoaderDataGuruManageMataPelajaranDetailAssignment } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageMataPelajaran
}
export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruManageMataPelajaranDetailAssignment> {
  const mataPelajaranId = params.mataPelajaranId as Kelas['id'] | null

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

  const assignments = await getPaginatedData({
    request,
    model: prisma.assignment,
    options: {
      defaultLimit: 10,
      where: {
        mataPelajaranId,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        }

        // const semesterAjaranId = query.get('semesterAjaranId')
        // if (semesterAjaranId) where.semesterAjaranId = semesterAjaranId

        return where
      },
      orderBy: [{ tanggalMulai: 'desc' }, { createdAt: 'desc' }],
    },
  })

  return { mataPelajaran, assignments } as LoaderDataGuruManageMataPelajaranDetailAssignment
}

export default function GuruManageMataPelajaranDetailAssignmentRoute() {
  return <GuruManageMataPelajaranDetailAssignmentPage />
}
