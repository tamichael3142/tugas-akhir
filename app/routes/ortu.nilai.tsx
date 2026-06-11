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
  return constants.pageMetas.ortuNilai
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

  const tahunAjarans = await prisma.tahunAjaran.findMany({
    where: { deletedAt: null },
    include: { semesterAjaran: true },
    orderBy: { tahunMulai: 'desc' },
  })

  const tahunAjaranIdParam = query.get('tahunAjaranId')
  const semesterAjaranIdParam = query.get('semesterAjaranId')

  let currentTahunAjaran = tahunAjaranIdParam
    ? (tahunAjarans.find(item => item.id === tahunAjaranIdParam) ?? null)
    : null

  if (!currentTahunAjaran)
    currentTahunAjaran =
      tahunAjarans.find(item => item.tahunMulai <= new Date() && item.tahunBerakhir >= new Date()) ??
      tahunAjarans[0] ??
      null

  let currentSemester = semesterAjaranIdParam
    ? (currentTahunAjaran?.semesterAjaran.find(item => item.id === semesterAjaranIdParam) ?? null)
    : null

  if (!currentSemester) {
    const currentSemesterUrutan = DBHelpers.semesterAjaran.getTodaySemesterAjaranUrutan()
    currentSemester = DBHelpers.semesterAjaran.getCurrentSemesterAjaranFromTahunAjaran({
      currentSemesterUrutan,
      semesterAjaran: currentTahunAjaran?.semesterAjaran ?? [],
    })
  }

  const kompetensis = await prisma.kompetensi.findMany({
    where: { deletedAt: null },
    orderBy: { sequenceNumber: 'asc' },
  })

  const kompetensiEkstrakulikulers = await prisma.kompetensiEkstrakulikuler.findMany({
    where: { deletedAt: null },
    orderBy: { sequenceNumber: 'asc' },
  })

  if (!siswaId)
    return {
      user: currUser,
      tahunAjarans,
      currentTahunAjaran,
      currentSemester,
      kompetensis,
      kompetensiEkstrakulikulers,
      penilaianEkstrakulikulers: [],
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
      siswaPerEkstrakulikuler: {
        where: {
          ekstrakulikuler: {
            tahunAjaranId: currentTahunAjaran?.id,
            deletedAt: null,
          },
        },
        include: {
          ekstrakulikuler: true,
        },
      },
    },
  })

  const penilaianEkstrakulikulers = await prisma.penilaianExtrakulikuler.findMany({
    where: {
      siswaId: siswaId,
      ekstrakulikulerId: {
        in: dataSiswa?.siswaPerEkstrakulikuler.map(item => item.ekstrakulikulerId) ?? [],
      },
    },
  })

  return {
    user: currUser,
    tahunAjarans,
    currentTahunAjaran,
    currentSemester,
    kompetensis,
    kompetensiEkstrakulikulers,
    penilaianEkstrakulikulers: penilaianEkstrakulikulers.map(item => ({
      ...item,
      nilai: DBUtils.decimal.decimalToNumber(item.nilai),
    })),
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
