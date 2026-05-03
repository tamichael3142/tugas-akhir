export enum Role {
  ADMIN = 'ADMIN',
  SISWA = 'SISWA',
  GURU = 'GURU',
  ORANGTUA = 'ORANGTUA',
}

export enum JenisKelamin {
  UNKNOWN = 'UNKNOWN',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum GolonganDarah {
  UNKNOWN = 'UNKNOWN',
  A = 'A',
  B = 'B',
  AB = 'AB',
  O = 'O',
}

export enum Kewarganegaraan {
  UNKNOWN = 'UNKNOWN',
  INDONESIA = 'INDONESIA',
  FOREIGN = 'FOREIGN',
}

export enum SemesterAjaranUrutan {
  SATU = 'SATU',
  DUA = 'DUA',
}

export enum TipeAbsensi {
  UNKNOWN = 'UNKNOWN',
  HADIR = 'HADIR',
  IZIN = 'IZIN',
  SAKIT = 'SAKIT',
  TANPA_KETERANGAN = 'TANPA_KETERANGAN',
}

export enum AssignmentSubmissionType {
  LONG_TEXT = 'LONG_TEXT',
  FILE_UPLOAD = 'FILE_UPLOAD',
  TIME_STAMP = 'TIME_STAMP',
}

export enum AssignmentSubmissionStatus {
  ASSIGNED = 'ASSIGNED',
  ON_PROGRESS = 'ON_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  SCORED = 'SCORED',
}

export enum DayID {
  MON = 'SENIN',
  TUE = 'SELASA',
  WED = 'RABU',
  THU = 'KAMIS',
  FRI = 'JUMAT',
}
