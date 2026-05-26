import { Kelas, MataPelajaran, MataPelajaranBeritaAcara } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraDetail } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'
import GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraDetailPage from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/BeritaAcara/Detail'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageBeritaAcara
}
export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraDetail> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null
  const beritaAcaraId = params.beritaAcaraId as MataPelajaranBeritaAcara['id'] | null

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

  const beritaAcara = await prisma.mataPelajaranBeritaAcara.findUnique({
    where: { id: beritaAcaraId ?? '' },
    include: {
      day: true,
      hourStart: true,
      hourEnd: true,
    },
  })

  return {
    kelas,
    mataPelajaran,
    beritaAcara,
  } as LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraDetail
}

export default function GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraDetailRoute() {
  return <GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraDetailPage />
}
