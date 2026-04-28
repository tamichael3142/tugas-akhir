import { MetaFunction, redirect } from '@remix-run/react'
import constants from '~/constants'
import { requireAuthCookie } from '~/utils/auth.utils'
import { LoaderFunctionArgs } from '@remix-run/node'
import { prisma } from '~/utils/db.server'
import { LoaderDataOrtuNilai } from '~/types/loaders-data/ortu'
import OrtuNilaiPage from '~/pages/ortu/Nilai'
import AppNav from '~/navigation'
import DBHelpers from '~/database/helpers'
import DBUtils from '~/database/utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.ortuDashboard
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataOrtuNilai> {
  const url = new URL(request.url)
  const query = url.searchParams

  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({
    where: { id: userId },
    include: {
      children: { include: { siswa: true } },
    },
  })

  if (!currUser) throw redirect(AppNav.auth.login())

  const siswaId = query.get('siswaId') as string | null

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
      user: currUser,
      currentTahunAjaran,
      currentSemester,
      kompetensis,
      dataSiswa: null,
    }

  if (!currUser.children.map(item => item.siswaId).includes(siswaId)) throw redirect(AppNav.ortu.nilaiSiswa())

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
    user: currUser,
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
  } as LoaderDataOrtuNilai
}

export default function OrtuNilaiRoute() {
  return <OrtuNilaiPage />
}
