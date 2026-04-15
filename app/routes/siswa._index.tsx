import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { prisma } from '~/utils/db.server'
import { differenceInDays } from 'date-fns'
import { LoaderDataSiswaIndex } from '~/types/loaders-data/siswa'
import SiswaDashboardPage from '~/pages/siswa/Dashboard'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaDashboard
}

export async function loader(): Promise<LoaderDataSiswaIndex> {
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

  const semesterAjaranId = currentTahunAjaran.semesterAjaran[0].id
  // if (!tahunAjaranId || !semesterAjaranId) {
  //   return {  currentTahunAjaran } as LoaderDataSiswaIndex
  // }

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
    },
  })

  return {
    days,
    hours,
    jadwalPelajarans,
    currentTahunAjaran,
  } as LoaderDataSiswaIndex
}

export default function SiswaJadwalMengajarRoute() {
  return <SiswaDashboardPage />
}
