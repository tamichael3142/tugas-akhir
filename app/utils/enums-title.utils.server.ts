import { $Enums } from '@prisma/client'

function getRole(value: $Enums.Role) {
  switch (value) {
    case $Enums.Role.ADMIN:
      return 'Admin'
    case $Enums.Role.GURU:
      return 'Guru'
    case $Enums.Role.ORANGTUA:
      return 'Orang Tua'
    case $Enums.Role.SISWA:
      return 'Siswa'
    default:
      return '-'
  }
}

function getJenisKelamin(value: $Enums.JenisKelamin) {
  switch (value) {
    case $Enums.JenisKelamin.MALE:
      return 'Laki-Laki'
    case $Enums.JenisKelamin.FEMALE:
      return 'Perempuan'
    case $Enums.JenisKelamin.UNKNOWN:
      return 'Tidak Diketahui'
    default:
      return '-'
  }
}

function getGolonganDarah(value: $Enums.GolonganDarah) {
  switch (value) {
    case $Enums.GolonganDarah.A:
      return 'A'
    case $Enums.GolonganDarah.AB:
      return 'AB'
    case $Enums.GolonganDarah.B:
      return 'B'
    case $Enums.GolonganDarah.O:
      return 'O'
    case $Enums.GolonganDarah.UNKNOWN:
      return 'Tidak Diketahui'
    default:
      return '-'
  }
}

function getKewarganegaraan(value: $Enums.Kewarganegaraan) {
  switch (value) {
    case $Enums.Kewarganegaraan.INDONESIA:
      return 'Indonesia'
    case $Enums.Kewarganegaraan.FOREIGN:
      return 'Asing'
    case $Enums.Kewarganegaraan.UNKNOWN:
      return 'Tidak Diketahui'
    default:
      return '-'
  }
}

const EnumsTitleUtils = { getRole, getJenisKelamin, getGolonganDarah, getKewarganegaraan }

export default EnumsTitleUtils
