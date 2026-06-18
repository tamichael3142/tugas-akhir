import { Akun, Kelas } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruDaftarKelasDetailDetailSiswaPage from '~/pages/guru/DaftarKelas/Detail/DaftarSiswa/Detail'
import { LoaderDataGuruDaftarKelasDetailDetailSiswa } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruDaftarKelas
}
export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelasDetailDetailSiswa> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const akunId = params.akunId as Akun['id'] | null

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

  // const currSemesterAjarans: string[] = []
  // kelas?.tahunAjaran.semesterAjaran.forEach(item => {
  //   currSemesterAjarans.push(item.id)
  // })

  const siswa = await prisma.akun.findUnique({
    where: { id: akunId ?? '' },
    include: {
      pelanggaransPerMapel: {
        where: {
          deletedAt: null,
          createdAt: {
            lte: kelas?.tahunAjaran.tahunBerakhir,
            gte: kelas?.tahunAjaran.tahunMulai,
          },
        },
        include: {
          mataPelajaran: true,
        },
      },
    },
  })

  const totalPoint = await prisma.pelanggaranPerMapel
    .aggregate({
      _sum: { poin: true },
      where: {
        siswaId: akunId ?? '',
        deletedAt: null,
        createdAt: {
          lte: kelas?.tahunAjaran.tahunBerakhir,
          gte: kelas?.tahunAjaran.tahunMulai,
        },
      },
    })
    .then(res => res._sum.poin ?? 0)
    .catch(() => 0)

  return { kelas, siswa, totalPoint } as LoaderDataGuruDaftarKelasDetailDetailSiswa
}

export default function GuruDaftarKelasDetailDetailSiswaRoute() {
  return <GuruDaftarKelasDetailDetailSiswaPage />
}
