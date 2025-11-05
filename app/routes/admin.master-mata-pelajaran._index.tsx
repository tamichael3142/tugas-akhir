import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import AdminMasterMataPelajaranPage from '~/pages/admin/MasterMataPelajaran'
import { LoaderDataAdminMasterMataPelajaran } from '~/types/loaders-data/admin'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminMasterMataPelajaran
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataAdminMasterMataPelajaran> {
  const tahunAjarans = await prisma.tahunAjaran.findMany({
    where: { deletedAt: null },
    include: { semesterAjaran: true },
  })
  const gurus = await prisma.akun.findMany({
    where: {
      guruMataPelajaran: {
        some: {
          // ? Kalau hanya mau filter kelas yang belum didelete
          // deletedAt: null,
        },
      },
    },
  })

  const mataPelajarans = await getPaginatedData({
    request,
    model: prisma.mataPelajaran,
    options: {
      defaultLimit: 10,
      include: {
        semesterAjaran: { include: { tahunAjaran: true } },
        guru: true,
      },
      mapQueryToWhere: async query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [{ nama: { contains: search, mode: 'insensitive' } }]
        }

        const tahunAjaranId = query.get('tahunAjaranId')
        if (tahunAjaranId) {
          const semesterAjaranId = query.get('semesterAjaranId')
          if (semesterAjaranId) {
            // ? Kalau tahun ajaran dan semester ajaran dipilih
            where.semesterAjaranId = semesterAjaranId
          } else {
            // ? Kalau tahun ajaran dipilih tapi semester ajaran semua
            const semesterAjarans = await prisma.semesterAjaran.findMany({ where: { tahunAjaranId: tahunAjaranId } })
            where.semesterAjaranId = {
              in: semesterAjarans.map(item => item.id),
            }
          }
        }

        const guruId = query.get('guruId')
        if (guruId) where.guruId = guruId

        return where
      },
      orderBy: [{ createdAt: 'desc' }],
    },
  })

  return {
    tahunAjarans,
    gurus,
    mataPelajarans,
  } as LoaderDataAdminMasterMataPelajaran
}

export default function AdminMasterMataPelajaranRoute() {
  return <AdminMasterMataPelajaranPage />
}
