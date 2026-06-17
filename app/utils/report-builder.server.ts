import { prisma } from '~/utils/db.server'
import { TipeAbsensi } from '~/database/enums/prisma.enums'
import { StudentReportData } from '~/types/loaders-data/admin'
import constants from '~/constants'
import DBUtils from '~/database/utils'
import { Kompetensi, KompetensiEkstrakulikuler, Penilaian, PenilaianExtrakulikuler } from '@prisma/client'

export async function buildStudentReportData(
  siswaId: string,
  semesterAjaranId: string,
  kelasId: string,
): Promise<StudentReportData | null> {
  const semesterAjaran = await prisma.semesterAjaran.findUnique({
    where: { id: semesterAjaranId },
    include: { tahunAjaran: true },
  })
  if (!semesterAjaran) return null

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId },
    include: { wali: true },
  })
  if (!kelas) return null

  const nomorAbsenRecord = await prisma.siswaPerKelasDanSemester.findFirst({
    where: { siswaId, kelasId, semesterAjaranId },
  })

  const student = await prisma.akun.findUnique({
    where: { id: siswaId },
    include: {
      siswaPerKelasDanSemester: {
        where: { kelasId, semesterAjaranId },
        include: { kelas: true },
      },
    },
  })
  if (!student) return null

  // Academic assessments
  const mataPelajarans = await prisma.mataPelajaran.findMany({
    where: {
      semesterAjaranId,
      jadwalPelajarans: { some: { kelasId } },
    },
    orderBy: { nama: 'asc' },
  })

  const penilaians = (await prisma.penilaian
    .findMany({
      where: {
        siswaId,
        kelasId,
        mataPelajaranId: { in: mataPelajarans.map(m => m.id) },
      },
      include: { kompetensi: true },
    })
    .then(res => res.map(item => ({ ...item, nilai: DBUtils.decimal.decimalToNumber(item.nilai) })))
    .catch(() => [])) as (Penilaian & { nilai: number | null; kompetensi: Kompetensi })[]

  const academicAssessments = mataPelajarans.map(mp => ({
    mataPelajaran: mp,
    kkm: mp.kkm,
    penilaians: penilaians.filter(p => p.mataPelajaranId === mp.id),
  }))

  // Extracurricular assessments
  const siswaEkstrakulikulers = await prisma.siswaPerEkstrakulikuler.findMany({
    where: { siswaId },
    include: { ekstrakulikuler: { include: { tahunAjaran: true } } },
  })

  const ekstrakulikulerIds = siswaEkstrakulikulers
    .filter(se => se.ekstrakulikuler.tahunAjaranId === semesterAjaran.tahunAjaranId)
    .map(se => se.ekstrakulikulerId)

  const penilaianEkstrakulikulers = (await prisma.penilaianExtrakulikuler
    .findMany({
      where: { siswaId, ekstrakulikulerId: { in: ekstrakulikulerIds } },
      include: { kompetensiEkstrakulikuler: true, ekstrakulikuler: true },
    })
    .then(res => res.map(item => ({ ...item, nilai: DBUtils.decimal.decimalToNumber(item.nilai) })))
    .catch(() => [])) as (PenilaianExtrakulikuler & {
    nilai: number | null
    kompetensiEkstrakulikuler: KompetensiEkstrakulikuler
  })[]

  const extracurricularAssessments = ekstrakulikulerIds.map(ekId => {
    const ek = siswaEkstrakulikulers.find(se => se.ekstrakulikulerId === ekId)!.ekstrakulikuler
    return {
      ekstrakulikuler: ek,
      penilaians: penilaianEkstrakulikulers.filter(p => p.ekstrakulikulerId === ekId),
    }
  })

  // Attendance summary
  const absensis = await prisma.absensi.findMany({
    where: { kelasId, semesterAjaranId },
    include: { siswaTerabsen: { where: { siswaId } } },
  })

  const attendanceSummary = absensis.reduce(
    (acc, absensi) => {
      const entry = absensi.siswaTerabsen[0]
      if (!entry) return acc
      if (entry.tipe === TipeAbsensi.SAKIT) acc.sick++
      else if (entry.tipe === TipeAbsensi.IZIN) acc.excused++
      else if (entry.tipe === TipeAbsensi.UNKNOWN) acc.unexcused++
      return acc
    },
    { sick: 0, excused: 0, unexcused: 0 },
  )

  // Homeroom note
  const studentReport = await prisma.studentReport.findUnique({
    where: { siswaId_semesterAjaranId: { siswaId, semesterAjaranId } },
  })

  // Competency descriptions
  const competencyDescriptions = await prisma.studentSubjectReport.findMany({
    where: { siswaId, semesterAjaranId },
    include: { mataPelajaran: true },
    orderBy: { mataPelajaran: { nama: 'asc' } },
  })

  return {
    schoolName: constants.sbbs.name.long,
    schoolAddress: constants.sbbs.address.long,
    schoolPhone: constants.sbbs.phone,
    student,
    kelas,
    semesterAjaran,
    nomorAbsen: nomorAbsenRecord?.nomorAbsen ?? null,
    academicAssessments,
    extracurricularAssessments,
    attendanceSummary,
    homeroomTeacherNote: studentReport?.homeroomTeacherNote ?? null,
    competencyDescriptions,
  }
}
