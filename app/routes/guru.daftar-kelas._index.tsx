import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruDaftarKelasPage from '~/pages/guru/DaftarKelas'
import { LoaderDataGuruDaftarKelas } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruDaftarKelas
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataGuruDaftarKelas> {
  const userId = await requireAuthCookie(request)

  const tahunAjarans = await prisma.tahunAjaran.findMany({
    where: { deletedAt: null },
    include: { semesterAjaran: true },
    orderBy: [{ tahunMulai: 'desc' }, { tahunBerakhir: 'desc' }, { createdAt: 'desc' }],
  })

  const waliKelass = await prisma.akun.findMany({
    where: {
      waliKelas: {
        some: {
          // ? Kalau hanya mau filter kelas yang belum didelete
          // deletedAt: null,
        },
      },
    },
  })

  const where = {
    deletedAt: null,
    OR: [
      { waliId: userId },
      {
        jadwalPelajarans: {
          some: {
            mataPelajaran: {
              guruId: userId,
            },
          },
        },
      },
    ],
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

        const tahunAjaranId = query.get('tahunAjaranId')
        if (tahunAjaranId) {
          const semesterAjaranId = query.get('semesterAjaranId')
          if (semesterAjaranId)
            where.tahunAjaran = {
              AND: [
                {
                  id: tahunAjaranId,
                },
                {
                  semesterAjaran: {
                    some: {
                      id: semesterAjaranId,
                    },
                  },
                },
              ],
            }
          else where.tahunAjaranId = tahunAjaranId
        }

        where.OR = OR

        return where
      },
      orderBy: [{ createdAt: 'desc' }],
    },
  })

  return {
    tahunAjarans,
    waliKelass,
    kelass,
  } as LoaderDataGuruDaftarKelas
}

export default function GuruDaftarKelasRoute() {
  return <GuruDaftarKelasPage />
}
