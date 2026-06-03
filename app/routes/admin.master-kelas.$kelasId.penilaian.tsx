import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { LoaderFunctionArgs } from '@remix-run/node'
import { prisma } from '~/utils/db.server'
import { LoaderDataAdminMasterKelasAssessment } from '~/types/loaders-data/admin'
import AdminMasterKelasPenilaianPage from '~/pages/admin/MasterKelas/Penilaian'
import { Kelas } from '@prisma/client'
import DBUtils from '~/database/utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterKelasPenilaian
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterKelasAssessment> {
  const kelasId = params.kelasId as Kelas['id'] | null

  const kompetensis = await prisma.kompetensi.findMany({
    where: { deletedAt: null },
    orderBy: { sequenceNumber: 'asc' },
  })

  const mataPelajarans = await prisma.mataPelajaran.findMany({
    where: {
      jadwalPelajarans: {
        some: {
          kelasId: kelasId ?? '',
        },
      },
    },
    include: {
      penilaians: true,
    },
  })

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
      },
    },
  })

  // const dataSiswa = await prisma.akun.findUnique({
  //   where: { id: siswaId },
  //   include: {
  //     siswaPerKelasDanSemester: {
  //       where: { semesterAjaranId: currentSemester?.id },
  //       include: {
  //         kelas: {
  //           include: {
  //             jadwalPelajarans: {
  //               where: { semesterAjaranId: currentSemester?.id },
  //               distinct: 'mataPelajaranId',
  //               include: {
  //                 mataPelajaran: true,
  //               },
  //             },
  //             penilaians: {
  //               where: {
  //                 siswaId: siswaId,
  //                 mataPelajaran: { semesterAjaranId: currentSemester?.id },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // })

  return {
    kelas,
    mataPelajarans: mataPelajarans.map(mapel => ({
      ...mapel,
      penilaians: mapel.penilaians.map(item => ({
        ...item,
        nilai: DBUtils.decimal.decimalToNumber(item.nilai),
      })),
    })),
    kompetensis,
  } as LoaderDataAdminMasterKelasAssessment
}

export default function AdminMasterKelasPenilaianRoute() {
  return <AdminMasterKelasPenilaianPage />
}
