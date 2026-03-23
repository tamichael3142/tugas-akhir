import {
  AssignmentSubmissionStatus,
  AssignmentSubmissionType,
  GolonganDarah,
  JenisKelamin,
  Kewarganegaraan,
  Role,
  SemesterAjaranUrutan,
  TipeAbsensi,
} from '~/database/enums/prisma.enums'

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

function getSemesterAjaranUrutan(value: SemesterAjaranUrutan) {
  switch (value) {
    case SemesterAjaranUrutan.SATU:
      return 'Genap'
    case SemesterAjaranUrutan.DUA:
      return 'Ganjil'
    default:
      return '-'
  }
}

function getTipeAbsensi(value: TipeAbsensi) {
  switch (value) {
    case TipeAbsensi.HADIR:
      return 'Hadir'
    case TipeAbsensi.IZIN:
      return 'Izin'
    case TipeAbsensi.SAKIT:
      return 'Sakit'
    case TipeAbsensi.TANPA_KETERANGAN:
      return 'Tanpa Keterangan'
    default:
      return '-'
  }
}

function getAssignmentSubmissionType(value: AssignmentSubmissionType) {
  switch (value) {
    case AssignmentSubmissionType.LONG_TEXT:
      return 'Long Text'
    case AssignmentSubmissionType.FILE_UPLOAD:
      return 'File Upload'
    case AssignmentSubmissionType.TIME_STAMP:
      return 'Timestamp'
    default:
      return '-'
  }
}

function getAssignmentSubmissionStatus(value: AssignmentSubmissionStatus) {
  switch (value) {
    case AssignmentSubmissionStatus.ASSIGNED:
      return 'Assigned'
    case AssignmentSubmissionStatus.ON_PROGRESS:
      return 'On Progress'
    case AssignmentSubmissionStatus.SUBMITTED:
      return 'Submitted'
    default:
      return '-'
  }
}

const EnumsTitleUtils = {
  getRole,
  getJenisKelamin,
  getGolonganDarah,
  getKewarganegaraan,
  getSemesterAjaranUrutan,
  getTipeAbsensi,
  getAssignmentSubmissionType,
  getAssignmentSubmissionStatus,
}

export default EnumsTitleUtils
