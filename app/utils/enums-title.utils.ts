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
      return 'Teacher'
    case Role.ORANGTUA:
      return 'Parent'
    case Role.SISWA:
      return 'Student'
    default:
      return '-'
  }
}

function getJenisKelamin(value: JenisKelamin) {
  switch (value) {
    case JenisKelamin.MALE:
      return 'Male'
    case JenisKelamin.FEMALE:
      return 'Female'
    case JenisKelamin.UNKNOWN:
      return 'Other'
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
      return 'Unknown'
    default:
      return '-'
  }
}

function getKewarganegaraan(value: Kewarganegaraan) {
  switch (value) {
    case Kewarganegaraan.INDONESIA:
      return 'Indonesia'
    case Kewarganegaraan.FOREIGN:
      return 'Foreign'
    case Kewarganegaraan.UNKNOWN:
      return 'Unknown'
    default:
      return '-'
  }
}

function getSemesterAjaranUrutan(value: SemesterAjaranUrutan) {
  switch (value) {
    case SemesterAjaranUrutan.SATU:
      return 'Odd'
    case SemesterAjaranUrutan.DUA:
      return 'Even'
    default:
      return '-'
  }
}

function getTipeAbsensi(value: TipeAbsensi) {
  switch (value) {
    case TipeAbsensi.HADIR:
      return 'Presence'
    case TipeAbsensi.IZIN:
      return 'Excused'
    case TipeAbsensi.SAKIT:
      return 'Sick'
    default:
      return 'X'
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
    case AssignmentSubmissionStatus.SCORED:
      return 'Scored'
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
