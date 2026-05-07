import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { requireAuthCookie } from '~/utils/auth.utils'
import { LoaderFunctionArgs } from '@remix-run/node'
import { prisma } from '~/utils/db.server'
import DBHelpers from '~/database/helpers'
import DBUtils from '~/database/utils'
import { LoaderDataSiswaNilai } from '~/types/loaders-data/siswa'
import SiswaNilaiPage from '~/pages/siswa/Nilai'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaNilai
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataSiswaNilai> {
  const siswaId = await requireAuthCookie(request)

  let currentTahunAjaran = await prisma.tahunAjaran.findFirst({
    where: {
      tahunMulai: { lte: new Date() },
      tahunBerakhir: { gte: new Date() },
    },
    include: { semesterAjaran: true },
  })

  if (!currentTahunAjaran)
    currentTahunAjaran = await prisma.tahunAjaran.findFirst({
      include: { semesterAjaran: true },
      orderBy: { createdAt: 'desc' },
    })

  const currentSemesterUrutan = DBHelpers.semesterAjaran.getTodaySemesterAjaranUrutan()
  const currentSemester = DBHelpers.semesterAjaran.getCurrentSemesterAjaranFromTahunAjaran({
    currentSemesterUrutan,
    semesterAjaran: currentTahunAjaran?.semesterAjaran ?? [],
  })

  const kompetensis = await prisma.kompetensi.findMany({
    orderBy: { sequenceNumber: 'asc' },
  })

  if (!siswaId)
    return {
      currentTahunAjaran,
      currentSemester,
      kompetensis,
      dataSiswa: null,
    }

  const dataSiswa = await prisma.akun.findUnique({
    where: { id: siswaId },
    include: {
      siswaPerKelasDanSemester: {
        where: { semesterAjaranId: currentSemester?.id },
        include: {
          kelas: {
            include: {
              jadwalPelajarans: {
                where: { semesterAjaranId: currentSemester?.id },
                distinct: 'mataPelajaranId',
                include: {
                  mataPelajaran: true,
                },
              },
              penilaians: {
                where: {
                  siswaId: siswaId,
                  mataPelajaran: { semesterAjaranId: currentSemester?.id },
                },
              },
            },
          },
        },
      },
    },
  })

  return {
    currentTahunAjaran,
    currentSemester,
    kompetensis,
    dataSiswa: {
      ...dataSiswa,
      siswaPerKelasDanSemester: dataSiswa?.siswaPerKelasDanSemester
        ? dataSiswa.siswaPerKelasDanSemester.map(siswaPerKelSem => ({
            ...siswaPerKelSem,
            kelas: {
              ...siswaPerKelSem.kelas,
              penilaians: siswaPerKelSem.kelas.penilaians.map(item => ({
                ...item,
                nilai: DBUtils.decimal.decimalToNumber(item.nilai),
              })),
            },
          }))
        : [],
    },
  } as LoaderDataSiswaNilai
}

export default function SiswaNilaiRoute() {
  return <SiswaNilaiPage />
}
