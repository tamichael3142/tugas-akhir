import { GolonganDarah, JenisKelamin, Kewarganegaraan, Role } from '~/database/enums/prisma.enums'

function getRole(value: string) {
  const enumerates = Object.values(Role)
  if (enumerates.includes(value as Role)) return Role[value as Role]
  else return Role.SISWA
}

function getJenisKelamin(value: string) {
  const enumerates = Object.values(JenisKelamin)
  if (enumerates.includes(value as JenisKelamin)) return JenisKelamin[value as JenisKelamin]
  else return JenisKelamin.UNKNOWN
}

function getGolonganDarah(value: string) {
  const enumerates = Object.values(GolonganDarah)
  if (enumerates.includes(value as GolonganDarah)) return GolonganDarah[value as GolonganDarah]
  else return GolonganDarah.UNKNOWN
}

function getKewarganegaraan(value: string) {
  const enumerates = Object.values(Kewarganegaraan)
  if (enumerates.includes(value as Kewarganegaraan)) return Kewarganegaraan[value as Kewarganegaraan]
  else return Kewarganegaraan.UNKNOWN
}

const EnumsValueUtils = { getRole, getJenisKelamin, getGolonganDarah, getKewarganegaraan }

export default EnumsValueUtils
