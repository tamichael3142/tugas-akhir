import { Pengumuman } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import DBHelpers from '~/database/helpers'
import SiswaPengumumanDetailPage from '~/pages/siswa/Pengumuman/Detail'
import { LoaderDataSiswaPengumumanDetail } from '~/types/loaders-data/siswa'
import { prisma } from '~/utils/db.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaPelanggaran
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataSiswaPengumumanDetail> {
  const pengumumanId = params.pengumumanId as Pengumuman['id'] | null

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

  const pengumuman = await prisma.pengumuman.findUnique({
    where: { deletedAt: null, id: pengumumanId ?? '' },
  })

  return {
    currentTahunAjaran,
    currentSemester,
    pengumuman,
  } as LoaderDataSiswaPengumumanDetail
}

export default function SiswaDaftarPengumumanDetailRoute() {
  return <SiswaPengumumanDetailPage />
}
