import {
  Absensi,
  AbsensiXSiswa,
  Akun,
  Days,
  Ekstrakulikuler,
  Hour,
  JadwalPelajaran,
  Kelas,
  KompetensiEkstrakulikuler,
  MataPelajaran,
  PenilaianExtrakulikuler,
  Pengumuman,
  ReportConfig,
  SemesterAjaran,
  SiswaPerEkstrakulikuler,
  SiswaPerKelasDanSemester,
  StudentReport,
  StudentSubjectReport,
  TahunAjaran,
  Assignment,
  MataPelajaranAttachment,
  Kompetensi,
  Penilaian,
  PelanggaranPerKelas,
  MataPelajaranBeritaAcara,
  AssignmentSubmission,
} from '@prisma/client'
import { PaginationReturns } from '~/utils/pagination.utils.server'

export type LoaderDataGuru = {
  user: Akun | null
}

/**
 * * Dashboard
 */
export type LoaderDataGuruDashboard = {
  currentTahunAjaran: (TahunAjaran & { semesterAjaran: SemesterAjaran[] }) | null
  currentSemester: SemesterAjaran | null
  days?: Days[]
  hours?: Hour[]
  jadwalPelajarans?: (JadwalPelajaran & { mataPelajaran: MataPelajaran | null; kelas: Kelas | null })[]
}

/**
 * * Jadwal Mengajar
 */
export type LoaderDataGuruJadwalMengajar = {
  tahunAjarans: (TahunAjaran & { semesterAjaran: SemesterAjaran[] })[]
  currentTahunAjaran: (TahunAjaran & { semesterAjaran: SemesterAjaran[] }) | null
  days?: Days[]
  hours?: Hour[]
  jadwalPelajarans?: (JadwalPelajaran & { mataPelajaran: MataPelajaran | null; kelas: Kelas | null })[]
}

/**
 * * Class List
 */
export type LoaderDataGuruDaftarKelas = {
  tahunAjarans: (TahunAjaran & { semesterAjaran: SemesterAjaran[] })[]
  currentTahunAjaran: (TahunAjaran & { semesterAjaran: SemesterAjaran[] }) | null
  waliKelass?: Akun[]
  kelass?: PaginationReturns<
    Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }
  >
}

export type LoaderDataGuruDaftarKelasDetail = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
}

/**
 * * Class list Detail > Daftar Siswa
 */
export type LoaderDataGuruDaftarKelasDetailDaftarSiswa = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
  siswaPerKelasPerSemesters: PaginationReturns<SiswaPerKelasDanSemester & { siswa: Akun | null }>
}

/**
 * * Class list Detail > Daftar Siswa > Detail
 */
export type LoaderDataGuruDaftarKelasDetailDetailSiswa = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
  siswa: Akun & { pelanggaransPerKelas: PelanggaranPerKelas[] }
  totalPoint: number
}

/**
 * * Class list Detail > Subject
 */
export type LoaderDataGuruDaftarKelasDetailMataPelajaran = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
  mataPelajarans: PaginationReturns<MataPelajaran & { guru: Akun | null }>
}

export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetail = {
  kelas: Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }
  mataPelajaran: MataPelajaran & {
    guru: Akun | null
    semesterAjaran: (SemesterAjaran & { tahunAjaran: TahunAjaran | null }) | null
  }
}

/**
 * * Class list Detail > Subject Detail > Berita Acara
 */
export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcara =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    beritaAcaras: PaginationReturns<MataPelajaranBeritaAcara & { day: Days; hourStart: Hour; hourEnd: Hour }>
  }

export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraCreate =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    hours: Hour[]
    days: Days[]
  }

export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraEdit =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    hours: Hour[]
    days: Days[]
    beritaAcara: MataPelajaranBeritaAcara & { day: Days; hourStart: Hour; hourEnd: Hour }
  }

export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraDetail =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    beritaAcara: MataPelajaranBeritaAcara & { day: Days; hourStart: Hour; hourEnd: Hour }
  }

/**
 * * Class list Detail > Subject Detail > Assignment
 */
export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignment =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    assignments: PaginationReturns<Assignment>
  }

export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentCreate =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    connectableKompetensis: Kompetensi[]
  }

export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentEdit =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    assignment: Assignment & { connectedKompetensi: Kompetensi | null }
    connectableKompetensis: Kompetensi[]
  }

export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    assignment: Assignment & { connectedKompetensi: Kompetensi | null }
    siswaPerKelasPerSemesters: (SiswaPerKelasDanSemester & { siswa: Akun })[]
    assignmentSubmissions: (AssignmentSubmission & { siswa: Akun })[]
    penilaians: Penilaian[]
  }

/**
 * * Class list Detail > Subject Detail > Attachment
 */
export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAttachment =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    attachments: PaginationReturns<MataPelajaranAttachment & { downloadUrl?: string }>
  }

export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentCreate =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail

export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentEdit =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    attachment: MataPelajaranAttachment & { downloadUrl?: string }
  }

/**
 * * Class list Detail > Subject Detail > Penilaian
 */
export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPenilaian =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    kompetensis: Kompetensi[]
    siswaPerKelasPerSemesters: (SiswaPerKelasDanSemester & { siswa: Akun | null })[]
    penilaians: Penilaian[]
  }

/**
 * * Class list Detail > Pelanggaran
 */
export type LoaderDataGuruDaftarKelasDetailPelanggaran = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
  pelanggarans: PaginationReturns<PelanggaranPerKelas & { siswa: Akun }>
}

export type LoaderDataGuruDaftarKelasDetailPelanggaranCreate = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
  siswas: Akun[]
}

export type LoaderDataGuruDaftarKelasDetailPelanggaranEdit = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
  siswas: Akun[]
  pelanggaran: PelanggaranPerKelas & { siswa: Akun }
}

/**
 * * Class list Detail > Absensi
 */
export type LoaderDataGuruDaftarKelasDetailAbsensiList = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
  todayAbsensi: Absensi | null
  absensis: PaginationReturns<Absensi>
}

export type LoaderDataGuruDaftarKelasDetailAbsensiCreate = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
}

/**
 * * Manage Ekstrakulikuler
 */
export type LoaderDataGuruManageEkstrakulikuler = {
  ekstrakulikulers: PaginationReturns<Ekstrakulikuler & { tahunAjaran: TahunAjaran }>
}

export type LoaderDataGuruManageEkstrakulikulerDetail = {
  ekstrakulikuler: (Ekstrakulikuler & { tahunAjaran: TahunAjaran; pengajar: Akun | null }) | null
}

export type LoaderDataGuruManageEkstrakulikulerDetailDaftarSiswa = LoaderDataGuruManageEkstrakulikulerDetail & {
  siswaPerEkstrakulikulers: PaginationReturns<SiswaPerEkstrakulikuler & { siswa: Akun | null }>
}

export type LoaderDataGuruManageEkstrakulikulerDetailAssessment = LoaderDataGuruManageEkstrakulikulerDetail & {
  kompetensiEkstrakulikulers: KompetensiEkstrakulikuler[]
  siswaPerEkstrakulikulers: (SiswaPerEkstrakulikuler & { siswa: Akun | null })[]
  penilaianEkstrakulikulers: PenilaianExtrakulikuler[]
}

/**
 * * Manage Subject
 */
export type LoaderDataGuruManageMataPelajaranDetail = {
  mataPelajaran: MataPelajaran & {
    guru: Akun | null
    semesterAjaran: (SemesterAjaran & { tahunAjaran: TahunAjaran | null }) | null
  }
}

export type LoaderDataGuruManageMataPelajaranDetailAssignment = {
  mataPelajaran: MataPelajaran & {
    guru: Akun | null
    semesterAjaran: (SemesterAjaran & { tahunAjaran: TahunAjaran | null }) | null
  }
  assignments: PaginationReturns<Assignment>
}

export type LoaderDataGuruManageMataPelajaranDetailAssignmentCreate = {
  mataPelajaran: MataPelajaran & {
    guru: Akun | null
    semesterAjaran: (SemesterAjaran & { tahunAjaran: TahunAjaran | null }) | null
  }
}

export type LoaderDataGuruManageMataPelajaranDetailAssignmentEdit = {
  mataPelajaran: MataPelajaran & {
    guru: Akun | null
    semesterAjaran: (SemesterAjaran & { tahunAjaran: TahunAjaran | null }) | null
  }
  assignment: Assignment
}

/**
 * * Manage Absensi
 */
export type LoaderDataGuruManageAbsensi = {
  absensis: PaginationReturns<Absensi & { kelas: Kelas }>
  tahunAjarans: (TahunAjaran & { semesterAjaran: SemesterAjaran[] })[]
}

export type LoaderDataGuruManageAbsensiEdit = {
  absensi:
    | (Absensi & { kelas: Kelas & { tahunAjaran: (TahunAjaran & { semesterAjaran: SemesterAjaran[] }) | null } })
    | null
}

export type LoaderDataGuruManageAbsensiMutate = {
  absensi: (Absensi & { siswaTerabsen: AbsensiXSiswa[] }) | null
  siswaPerKelasPerSemesters: (SiswaPerKelasDanSemester & { siswa: Akun | null })[]
}

/**
 * * Manage Violations
 */
export type LoaderDataGuruManageViolations = {
  pelanggarans: PaginationReturns<
    PelanggaranPerKelas & { siswa: Akun; kelas: Kelas; createdBy: Akun | null }
  >
  kelass: Kelas[]
}

export type LoaderDataGuruManageViolationsCreate = {
  siswas: Akun[]
  kelass: Kelas[]
}

export type LoaderDataGuruManageViolationsEdit = LoaderDataGuruManageViolationsCreate & {
  pelanggaran: PelanggaranPerKelas
}

/**
 * * Master Announcement
 */
export type LoaderDataGuruMasterPengumuman = {
  pengumumans: PaginationReturns<Pengumuman & { createdBy: Akun | null }>
}

export type LoaderDataGuruMasterPengumumanEdit = {
  pengumuman: Pengumuman | null
}

/**
 * * Report Descriptions (Subject Teacher)
 */
export type LoaderDataGuruReportDescriptions = LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
  reportConfig: ReportConfig | null
  siswaPerKelasPerSemesters: (SiswaPerKelasDanSemester & { siswa: Akun })[]
  studentSubjectReports: StudentSubjectReport[]
  semesterAjaranId: string | null
}

/**
 * * Homeroom Notes
 */
export type LoaderDataGuruHomeroomNotes = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
  reportConfig: ReportConfig | null
  siswaPerKelasPerSemesters: (SiswaPerKelasDanSemester & { siswa: Akun })[]
  studentReports: StudentReport[]
  selectedSemesterAjaranId: string | null
}

export type LoaderDataGuruHomeroomNotesEdit = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
  siswa: Akun | null
  studentReport: StudentReport | null
  semesterAjaranId: string | null
}

/**
 * * Account
 */
export type LoaderDataGuruAccount = {
  account: Akun & { profileImageObjectUrl?: string }
}

export type LoaderDataGuruAccountChangePassword = LoaderDataGuruAccount
