import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruJadwalMengajarPage from '~/pages/guru/JadwalMengajar'
import { LoaderDataGuruJadwalMengajar } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { differenceInDays } from 'date-fns'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruJadwalMengajar
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataGuruJadwalMengajar> {
  const url = new URL(request.url)
  const query = url.searchParams
  const userId = await requireAuthCookie(request)

  const tahunAjaranId = query.get('tahunAjaranId')
  const semesterAjaranId = query.get('semesterAjaranId')

  const tahunAjarans = await prisma.tahunAjaran.findMany({
    where: { deletedAt: null },
    include: { semesterAjaran: true },
    orderBy: [{ tahunMulai: 'desc' }, { tahunBerakhir: 'desc' }, { createdAt: 'desc' }],
  })

  // ? untuk mencari tahun ajaran sekarang
  const today = new Date()
  let currentTahunAjaran = tahunAjarans.find(item => item.tahunMulai.getFullYear() === today.getFullYear())
  if (!currentTahunAjaran)
    currentTahunAjaran = tahunAjarans.find(item => item.tahunBerakhir.getFullYear() === today.getFullYear())
  if (!currentTahunAjaran)
    currentTahunAjaran = tahunAjarans
      .filter(
        item =>
          item.tahunMulai.getFullYear() <= today.getFullYear() &&
          item.tahunBerakhir.getFullYear() >= today.getFullYear(),
      )
      .sort((a, b) => differenceInDays(today, a.tahunMulai) - differenceInDays(today, b.tahunMulai))[0]

  if (!tahunAjaranId || !semesterAjaranId) {
    return { tahunAjarans, currentTahunAjaran } as LoaderDataGuruJadwalMengajar
  }

  const days = await prisma.days.findMany({ orderBy: { sequenceNumber: 'asc' } })
  const hours = await prisma.hour.findMany({ orderBy: { sequenceNumber: 'asc' } })

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
