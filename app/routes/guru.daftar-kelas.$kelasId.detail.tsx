import { Kelas } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruDaftarKelasDetailPage from '~/pages/guru/DaftarKelas/Detail'
import { LoaderDataGuruDaftarKelasDetail } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruDaftarKelas
}
export async function loader({ request, params }: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetail> {
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

  const siswaPerKelasPerSemesters = await getPaginatedData({
    request,
    model: prisma.siswaPerKelasDanSemester,
    options: {
      defaultLimit: 50,
      include: {
        siswa: true,
      },
      where: {
        kelasId: kelasId,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            // ? Ini untuk search ke data yang di dalam reference
            { siswa: { is: { username: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { nip: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { displayName: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { firstName: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { lastName: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { email: { contains: search, mode: 'insensitive' } } } },
          ]
        }

        const semesterAjaranId = query.get('semesterAjaranId')
        if (semesterAjaranId) where.semesterAjaranId = semesterAjaranId

        return where
      },
      orderBy: [{ siswa: { createdAt: 'desc' } }],
    },
  })

  return { kelas, siswaPerKelasPerSemesters } as LoaderDataGuruDaftarKelasDetail
}

export default function GuruDaftarKelasDetailRoute() {
  return <GuruDaftarKelasDetailPage />
}
