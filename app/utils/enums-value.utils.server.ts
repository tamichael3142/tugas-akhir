import { $Enums } from '@prisma/client'

function getRole(value: string) {
  const enumerates = Object.values($Enums.Role)
  if (enumerates.includes(value as $Enums.Role)) return $Enums.Role[value as $Enums.Role]
  else return $Enums.Role.SISWA
}

function getJenisKelamin(value: string) {
  const enumerates = Object.values($Enums.JenisKelamin)
  if (enumerates.includes(value as $Enums.JenisKelamin)) return $Enums.JenisKelamin[value as $Enums.JenisKelamin]
  else return $Enums.JenisKelamin.UNKNOWN
}

function getGolonganDarah(value: string) {
  const enumerates = Object.values($Enums.GolonganDarah)
  if (enumerates.includes(value as $Enums.GolonganDarah)) return $Enums.GolonganDarah[value as $Enums.GolonganDarah]
  else return $Enums.GolonganDarah.UNKNOWN
}

function getKewarganegaraan(value: string) {
  const enumerates = Object.values($Enums.Kewarganegaraan)
  if (enumerates.includes(value as $Enums.Kewarganegaraan))
    return $Enums.Kewarganegaraan[value as $Enums.Kewarganegaraan]
  else return $Enums.Kewarganegaraan.UNKNOWN
}

const EnumsValueUtils = { getRole, getJenisKelamin, getGolonganDarah, getKewarganegaraan }

export default EnumsValueUtils
