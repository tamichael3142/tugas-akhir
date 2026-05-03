import { MetaFunction, redirect } from '@remix-run/react'
import constants from '~/constants'
import { requireAuthCookie } from '~/utils/auth.utils'
import { LoaderFunctionArgs } from '@remix-run/node'
import { prisma } from '~/utils/db.server'
import { KelasAbsensiStats, LoaderDataOrtuAbsensi } from '~/types/loaders-data/ortu'
import AppNav from '~/navigation'
import DBHelpers from '~/database/helpers'
import OrtuAbsensiPage from '~/pages/ortu/Absensi'
import { TipeAbsensi } from '@prisma/client'

export const meta: MetaFunction = () => {
  return constants.pageMetas.ortuAbsensi
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataOrtuAbsensi> {
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

  if (!siswaId)
    return {
      user: currUser,
      currentTahunAjaran,
      currentSemester,
      kelass: null,
    }

  if (!currUser.children.map(item => item.siswaId).includes(siswaId)) throw redirect(AppNav.ortu.absensiSiswa())

  // const absensis = await prisma.absensi.findMany({
  //   include: {
  //     siswaTerabsen: true,
  //   },
  //   where: {
  //     semesterAjaranId: currentSemester?.id,
  //     siswaTerabsen: {
  //       some: {
  //         siswaId: siswaId,
  //       },
  //     },
  //   },
  // })

  const kelass = await prisma.kelas.findMany({
    where: {
      siswaPerKelasDanSemester: {
        some: {
          siswaId: siswaId,
        },
      },
      tahunAjaranId: currentTahunAjaran?.id,
      absensis: {
        some: {
          semesterAjaranId: currentSemester?.id,
          siswaTerabsen: {
            some: {
              siswaId: siswaId,
            },
          },
        },
      },
    },
    include: {
      absensis: {
        include: {
          siswaTerabsen: {
            where: {
              siswaId: siswaId,
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
    kelass: kelass.map(kelas => {
      const stats: KelasAbsensiStats = {
        totalHadir: 0,
        totalIzin: 0,
        totalSakit: 0,
        totalTanpaKeterangan: 0,
      }

      kelas.absensis.forEach(absensi => {
        absensi.siswaTerabsen.map(terabsen => {
          if (terabsen.tipe === TipeAbsensi.HADIR) stats.totalHadir++
          else if (terabsen.tipe === TipeAbsensi.IZIN) stats.totalIzin++
          else if (terabsen.tipe === TipeAbsensi.SAKIT) stats.totalSakit++
          else if (terabsen.tipe === TipeAbsensi.TANPA_KETERANGAN) stats.totalTanpaKeterangan++
        })
      })

      return {
        ...kelas,
        stats,
      }
    }),
  } as LoaderDataOrtuAbsensi
}

export default function OrtuAbsensiRoute() {
  return <OrtuAbsensiPage />
}
