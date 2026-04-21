import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import DBHelpers from '~/database/helpers'
import { LoaderDataSiswaAccountPelanggaran } from '~/types/loaders-data/siswa'
import { prisma } from '~/utils/db.server'
import SiswaAccountPelanggaranPage from '~/pages/siswa/Account/Pelanggaran'
import { getPaginatedData } from '~/utils/pagination.utils.server'
import { LoaderFunctionArgs } from '@remix-run/node'
import { requireAuthCookie } from '~/utils/auth.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaPelanggaran
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataSiswaAccountPelanggaran> {
  const userId = await requireAuthCookie(request)

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

  const pelanggarans = await getPaginatedData({
    request,
    model: prisma.pelanggaranPerMapel,
    options: {
      defaultLimit: 10,
      where: {
        siswaId: userId,
      },
      include: {
        mataPelajaran: true,
        kelas: true,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            { poin: { contains: search, mode: 'insensitive' } },
            { remark: { contains: search, mode: 'insensitive' } },
          ]
        }

        return where
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    },
  })

  const totalPoint = await prisma.pelanggaranPerMapel
    .aggregate({
      _sum: { poin: true },
      where: { siswaId: userId },
    })
    .then(res => res._sum.poin ?? 0)
    .catch(() => 0)

  return {
    currentTahunAjaran,
    currentSemester,
    pelanggarans,
    totalPoint,
  } as LoaderDataSiswaAccountPelanggaran
}

export default function SiswaDaftarAccountPelanggaranRoute() {
  return <SiswaAccountPelanggaranPage />
}
