import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import DBHelpers from '~/database/helpers'
import OrtuPengumumanPage from '~/pages/ortu/Pengumuman'
import { LoaderDataOrtuPengumuman } from '~/types/loaders-data/ortu'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.ortuPengumuman
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataOrtuPengumuman> {
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

  const where = {
    deletedAt: null,
  }

  const pengumumans = await getPaginatedData({
    request,
    model: prisma.pengumuman,
    options: {
      defaultLimit: 6,
      where,
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let OR: any[] = []

        const search = query.get('search')
        if (search) {
          OR = [...OR, { nama: { contains: search, mode: 'insensitive' } }]
        }

        where.OR = OR

        return where
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    },
  })

  return {
    currentTahunAjaran,
    currentSemester,
    pengumumans,
  } as LoaderDataOrtuPengumuman
}

export default function OrtuPengumumanRoute() {
  return <OrtuPengumumanPage />
}
