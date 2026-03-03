import { Kelas } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruDaftarKelasDetailMataPelajaranPage from '~/pages/guru/DaftarKelas/Detail/MataPelajaran'
import { LoaderDataGuruDaftarKelasDetailMataPelajaran } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruDaftarKelas
}
export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailMataPelajaran> {
  const kelasId = params.kelasId as Kelas['id'] | null

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

  const mataPelajarans = await getPaginatedData({
    request,
    model: prisma.mataPelajaran,
    options: {
      defaultLimit: 50,
      include: { guru: true },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let where: any = {}

        const jadwalPelajaransSomeAnd: object[] = [{ kelasId: kelasId ?? '' }]

        const search = query.get('search')
        if (search) {
          where.OR = [
            // ? Ini untuk search ke data yang di dalam reference
            { nama: { contains: search, mode: 'insensitive' } },
          ]
        }

        const semesterAjaranId = query.get('semesterAjaranId')
        if (semesterAjaranId) jadwalPelajaransSomeAnd.push({ semesterAjaranId: semesterAjaranId })

        where = {
          ...where,
          jadwalPelajarans: {
            some: {
              AND: jadwalPelajaransSomeAnd,
            },
          },
        }

        return where
      },
      orderBy: [{ createdAt: 'desc' }],
    },
  })

  return { kelas, mataPelajarans } as LoaderDataGuruDaftarKelasDetailMataPelajaran
}

export default function GuruDaftarKelasDetailMataPelajaranRoute() {
  return <GuruDaftarKelasDetailMataPelajaranPage />
}
