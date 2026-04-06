import { Kelas, MataPelajaran } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraPage from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/BeritaAcara'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcara } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageBeritaAcara
}
export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcara> {
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

  const beritaAcaras = await getPaginatedData({
    request,
    model: prisma.mataPelajaranBeritaAcara,
    options: {
      defaultLimit: 10,
      where: {
        mataPelajaranId,
        kelasId,
      },
      include: {
        day: true,
        hourStart: true,
        hourEnd: true,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { remark: { contains: search, mode: 'insensitive' } },
          ]
        }

        return where
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    },
  })

  return { kelas, mataPelajaran, beritaAcaras } as LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcara
}

export default function GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraRoute() {
  return <GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraPage />
}
