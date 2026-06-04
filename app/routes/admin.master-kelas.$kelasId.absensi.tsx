import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { LoaderFunctionArgs } from '@remix-run/node'
import { prisma } from '~/utils/db.server'
import { LoaderDataAdminMasterKelasAbsensi } from '~/types/loaders-data/admin'
import { Kelas } from '@prisma/client'
import AdminMasterKelasAbsensiPage from '~/pages/admin/MasterKelas/Absensi'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterKelasAbsensi
}

export async function loader({ request, params }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterKelasAbsensi> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const url = new URL(request.url)
  const query = url.searchParams

  const startDate = (query.get('startDate') ?? null) as string | null
  const endDate = (query.get('endDate') ?? null) as string | null

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId ?? '' },
    include: {
      tahunAjaran: {
        include: { semesterAjaran: true },
      },
      wali: true,
      siswaPerKelasDanSemester: {
        where: { kelasId: kelasId ?? '' },
        include: {
          siswa: true,
        },
        distinct: 'siswaId',
      },
    },
  })

  if (!startDate || !endDate)
    return {
      kelas,
    } as LoaderDataAdminMasterKelasAbsensi

  const absensis = await prisma.absensi.findMany({
    where: {
      kelasId: kelasId ?? '',
      tanggal: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: {
      siswaTerabsen: true,
    },
    orderBy: [{ tanggal: 'asc' }],
  })

  return {
    kelas,
    absensis,
  } as LoaderDataAdminMasterKelasAbsensi
}

export default function AdminMasterKelasAbsensiRoute() {
  return <AdminMasterKelasAbsensiPage />
}
