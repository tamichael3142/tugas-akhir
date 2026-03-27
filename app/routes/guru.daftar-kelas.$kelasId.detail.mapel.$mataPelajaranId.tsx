import { Kelas } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruDaftarKelasDetailMataPelajaranDetail from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetail } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruDaftarKelas
}
export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailMataPelajaranDetail> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const mataPelajaranId = params.mataPelajaranId as Kelas['id'] | null

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

  return { kelas, mataPelajaran } as LoaderDataGuruDaftarKelasDetailMataPelajaranDetail
}

export default function GuruDaftarKelasDetailMataPelajaranDetailAssignmentRoute() {
  return <GuruDaftarKelasDetailMataPelajaranDetail />
}
