import { SemesterAjaran } from '@prisma/client'
import { SemesterAjaranUrutan } from '../enums/prisma.enums'

function getTodaySemesterAjaranUrutan() {
  return new Date().getMonth() < 6 ? SemesterAjaranUrutan.DUA : SemesterAjaranUrutan.SATU
}

function getCurrentSemesterAjaranFromTahunAjaran({
  semesterAjaran,
  currentSemesterUrutan,
}: {
  semesterAjaran: SemesterAjaran[]
  currentSemesterUrutan: SemesterAjaranUrutan
}) {
  return semesterAjaran.find(item => item.urutan === currentSemesterUrutan) ?? null
}

const semesterAjaran = {
  getTodaySemesterAjaranUrutan,
  getCurrentSemesterAjaranFromTahunAjaran,
}

export default semesterAjaran
