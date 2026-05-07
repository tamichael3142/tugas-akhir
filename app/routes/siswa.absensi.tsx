import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { requireAuthCookie } from '~/utils/auth.utils'
import { LoaderFunctionArgs } from '@remix-run/node'
import { prisma } from '~/utils/db.server'
import DBHelpers from '~/database/helpers'
import { TipeAbsensi } from '@prisma/client'
import { LoaderDataSiswaAbsensi, KelasAbsensiStats } from '~/types/loaders-data/siswa'
import SiswaAbsensiPage from '~/pages/siswa/Absensi'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaAbsensi
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataSiswaAbsensi> {
  const siswaId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: siswaId } })

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
      user: null,
      currentTahunAjaran,
      currentSemester,
      kelass: null,
    }

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
  } as LoaderDataSiswaAbsensi
}

export default function SiswaAbsensiRoute() {
  return <SiswaAbsensiPage />
}
