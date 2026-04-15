import { SemesterAjaran, SemesterAjaranUrutan } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import SiswaKelasPage from '~/pages/siswa/Kelas'
import { LoaderDataSiswaKelas } from '~/types/loaders-data/siswa'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaKelas
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataSiswaKelas> {
  const userId = await requireAuthCookie(request)

  let currentTahunAjaran = await prisma.tahunAjaran.findFirst({
    where: {
      tahunMulai: { lte: new Date() },
      tahunBerakhir: { gte: new Date() },
    },
    include: { semesterAjaran: true },
  })

  const currentSemesterUrutan = new Date().getMonth() < 6 ? SemesterAjaranUrutan.DUA : SemesterAjaranUrutan.SATU
  let currentSemester: SemesterAjaran | null = null

  if (!currentTahunAjaran)
    currentTahunAjaran = await prisma.tahunAjaran.findFirst({
      include: { semesterAjaran: true },
      orderBy: { createdAt: 'desc' },
    })

  if (currentTahunAjaran) {
    currentSemester = currentTahunAjaran.semesterAjaran.find(item => item.urutan === currentSemesterUrutan) ?? null
  }

  const where = {
    deletedAt: null,
    tahunAjaranId: currentTahunAjaran?.id,
    siswaPerKelasDanSemester: {
      some: {
        siswaId: userId,
        ...(currentSemester && {
          semesterAjaranId: currentSemester.id,
        }),
      },
    },
  }

  const kelass = await getPaginatedData({
    request,
    model: prisma.kelas,
    options: {
      defaultLimit: 10,
      where,
      include: {
        tahunAjaran: {
          include: { semesterAjaran: true },
        },
        jadwalPelajarans: {
          include: { mataPelajaran: true },
        },
        wali: true,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let OR: any[] = []

        const search = query.get('search')
        if (search) {
          OR = [
            ...OR,
            { nama: { contains: search, mode: 'insensitive' } },
            // ? NOTE: kalau mau in depth search juga bisa sperti di bawah ini
            // {
            //   tahunAjaran: {
            //     nama: { contains: search, mode: 'insensitive' },
            //   },
            // },
          ]
        }

        const waliId = query.get('waliId')
        if (waliId) where.waliId = waliId

        where.OR = OR

        return where
      },
      orderBy: [{ createdAt: 'desc' }],
    },
  })

  return {
    currentTahunAjaran,
    currentSemester,
    kelass,
  } as LoaderDataSiswaKelas
}

export default function SiswaDaftarKelasRoute() {
  return <SiswaKelasPage />
}
