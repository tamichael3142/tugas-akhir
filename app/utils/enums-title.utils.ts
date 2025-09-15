import { GolonganDarah, JenisKelamin, Kewarganegaraan, Role } from '~/enums/prisma.enums.client'

function getRole(value: Role) {
  switch (value) {
    case Role.ADMIN:
      return 'Admin'
    case Role.GURU:
      return 'Guru'
    case Role.ORANGTUA:
      return 'Orang Tua'
    case Role.SISWA:
      return 'Siswa'
    default:
      return '-'
  }
}

function getJenisKelamin(value: JenisKelamin) {
  switch (value) {
    case JenisKelamin.MALE:
      return 'Laki-Laki'
    case JenisKelamin.FEMALE:
      return 'Perempuan'
    case JenisKelamin.UNKNOWN:
      return 'Tidak Diketahui'
    default:
      return '-'
  }
}

function getGolonganDarah(value: GolonganDarah) {
  switch (value) {
    case GolonganDarah.A:
      return 'A'
    case GolonganDarah.AB:
      return 'AB'
    case GolonganDarah.B:
      return 'B'
    case GolonganDarah.O:
      return 'O'
    case GolonganDarah.UNKNOWN:
      return 'Tidak Diketahui'
    default:
      return '-'
  }
}

function getKewarganegaraan(value: Kewarganegaraan) {
  switch (value) {
    case Kewarganegaraan.INDONESIA:
      return 'Indonesia'
    case Kewarganegaraan.FOREIGN:
      return 'Asing'
    case Kewarganegaraan.UNKNOWN:
      return 'Tidak Diketahui'
    default:
      return '-'
  }
}

const EnumsTitleUtils = { getRole, getJenisKelamin, getGolonganDarah, getKewarganegaraan }

export default EnumsTitleUtils
