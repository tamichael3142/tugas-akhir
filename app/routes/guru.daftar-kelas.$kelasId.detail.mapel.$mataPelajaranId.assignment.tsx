import { Kelas, MataPelajaran } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruDaftarKelasDetailMataPelajaranDetailAssignmentPage from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Assignment'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignment } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruDaftarKelas
}
export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignment> {
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

  const assignments = await getPaginatedData({
    request,
    model: prisma.assignment,
    options: {
      defaultLimit: 10,
      where: {
        mataPelajaranId,
        kelasId,
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

        return where
      },
      orderBy: [{ tanggalMulai: 'desc' }, { createdAt: 'desc' }],
    },
  })

  return { kelas, mataPelajaran, assignments } as LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignment
}

export default function GuruDaftarKelasDetailMataPelajaranDetailAssignmentRoute() {
  return <GuruDaftarKelasDetailMataPelajaranDetailAssignmentPage />
}
