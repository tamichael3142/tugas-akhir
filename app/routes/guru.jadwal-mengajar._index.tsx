import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruJadwalMengajarPage from '~/pages/guru/JadwalMengajar'
import { LoaderDataGuruJadwalMengajar } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruJadwalMengajar
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataGuruJadwalMengajar> {
  const url = new URL(request.url)
  const query = url.searchParams
  const userId = await requireAuthCookie(request)

  const tahunAjaranId = query.get('tahunAjaranId')
  const semesterAjaranId = query.get('semesterAjaranId')
  const kelasId = query.get('kelasId')

  const tahunAjarans = await prisma.tahunAjaran.findMany({
    where: { deletedAt: null },
    include: { semesterAjaran: true },
    orderBy: [{ tahunMulai: 'desc' }, { tahunBerakhir: 'desc' }, { createdAt: 'desc' }],
  })

  // ? untuk mencari tahun ajaran sekarang
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

  if (!tahunAjaranId || !semesterAjaranId) {
    return { tahunAjarans, currentTahunAjaran } as LoaderDataGuruJadwalMengajar
  }

  const days = await prisma.days.findMany({ orderBy: { sequenceNumber: 'asc' } })
  const hours = await prisma.hour.findMany({ orderBy: { sequenceNumber: 'asc' } })

  let where = {}
  if (kelasId) where = { ...where, kelasId }

  const jadwalPelajarans = await prisma.jadwalPelajaran.findMany({
    include: {
      kelas: true,
      mataPelajaran: {
        include: {
          semesterAjaran: true,
        },
      },
    },
    where: {
      ...where,
      semesterAjaranId: semesterAjaranId,
      mataPelajaran: {
        guruId: userId,
      },
    },
  })

  return {
    tahunAjarans,
    days,
    hours,
    jadwalPelajarans,
    currentTahunAjaran,
  } as LoaderDataGuruJadwalMengajar
}

export default function GuruJadwalMengajarRoute() {
  return <GuruJadwalMengajarPage />
}
