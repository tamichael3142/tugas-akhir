import { Kelas } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruDaftarKelasDetailPelanggaranPage from '~/pages/guru/DaftarKelas/Detail/Pelanggaran'
import { LoaderDataGuruDaftarKelasDetailPelanggaran } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManagePelanggaran
}

export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailPelanggaran> {
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

  const pelanggarans = await getPaginatedData({
    request,
    model: prisma.pelanggaranPerKelas,
    options: {
      defaultLimit: 10,
      where: {
        kelasId,
      },
      include: {
        siswa: true,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            { remark: { contains: search, mode: 'insensitive' } },
            { siswa: { firstName: { contains: search, mode: 'insensitive' } } },
            { siswa: { lastName: { contains: search, mode: 'insensitive' } } },
          ]
        }

        return where
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    },
  })

  return { kelas, pelanggarans } as LoaderDataGuruDaftarKelasDetailPelanggaran
}

export default function GuruDaftarKelasDetailPelanggaranRoute() {
  return <GuruDaftarKelasDetailPelanggaranPage />
}
