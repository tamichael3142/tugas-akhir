import {
  Akun,
  Assignment,
  AssignmentSubmission,
  Days,
  Hour,
  JadwalPelajaran,
  Kelas,
  Kompetensi,
  MataPelajaran,
  MataPelajaranAttachment,
  PelanggaranPerMapel,
  Pengumuman,
  Penilaian,
  SemesterAjaran,
  TahunAjaran,
} from '@prisma/client'
import { PaginationReturns } from '~/utils/pagination.utils.server'

export type LoaderDataSiswa = {
  user: Akun | null
}

type CurrentTahunAndSemesterAjaran = {
  currentTahunAjaran: (TahunAjaran & { semesterAjaran: SemesterAjaran[] }) | null
  currentSemester: SemesterAjaran | null
}

/**
 * * Dashboard
 */
export type LoaderDataSiswaIndex = {
  // currentTahunAjaran: (TahunAjaran & { semesterAjaran: SemesterAjaran[] }) | null
  days?: Days[]
  hours?: Hour[]
  jadwalPelajarans?: (JadwalPelajaran & { mataPelajaran: MataPelajaran | null; kelas: Kelas | null })[]
}

/**
 * * Kelas
 */

export type LoaderDataSiswaKelas = CurrentTahunAndSemesterAjaran & {
  kelass?: PaginationReturns<
    Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }
  >
}

export type LoaderDataSiswaKelasDetail = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
}

/**
 * * Kelas > Mata Pelajaran
 */
export type LoaderDataSiswaKelasDetailMataPelajaran = CurrentTahunAndSemesterAjaran & {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
  mataPelajarans: PaginationReturns<MataPelajaran & { guru: Akun | null }>
}

export type LoaderDataSiswaKelasDetailMataPelajaranDetail = CurrentTahunAndSemesterAjaran & {
  kelas: Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }
  mataPelajaran: MataPelajaran & {
    guru: Akun | null
    semesterAjaran: (SemesterAjaran & { tahunAjaran: TahunAjaran | null }) | null
  }
}

/**
 * * Kelas > Mata Pelajaran > Assignment
 */
export type LoaderDataSiswaKelasDetailMataPelajaranDetailAssignment = LoaderDataSiswaKelasDetailMataPelajaranDetail & {
  assignments: PaginationReturns<Assignment>
}

export type LoaderDataSiswaKelasDetailMataPelajaranDetailAssignmentDetail =
  LoaderDataSiswaKelasDetailMataPelajaranDetail & {
    assignment: Assignment
    assignmentSubmission: AssignmentSubmission | null
  }

/**
 * * Kelas > Mata Pelajaran > Attachment
 */
export type LoaderDataSiswaKelasDetailMataPelajaranDetailAttachment = LoaderDataSiswaKelasDetailMataPelajaranDetail & {
  attachments: PaginationReturns<MataPelajaranAttachment & { downloadUrl?: string }>
}

/**
 * * Kelas > Mata Pelajaran > Penilaian
 */
export type LoaderDataSiswaKelasDetailMataPelajaranDetailPenilaian = LoaderDataSiswaKelasDetailMataPelajaranDetail & {
  kompetensis: Kompetensi[]
  penilaians: Penilaian[]
  siswa: Akun
}

/**
 * * Kelas > Mata Pelajaran > Pelanggaran
 */
export type LoaderDataSiswaKelasDetailMataPelajaranDetailPelanggaran = LoaderDataSiswaKelasDetailMataPelajaranDetail & {
  pelanggarans: PaginationReturns<PelanggaranPerMapel>
}

/**
 * * Pengumuman
 */
export type LoaderDataSiswaPengumuman = {
  pengumumans?: PaginationReturns<Pengumuman>
}

export type LoaderDataSiswaPengumumanDetail = {
  pengumuman: Pengumuman
}

/**
 * * Account
 */
export type LoaderDataSiswaAccount = CurrentTahunAndSemesterAjaran & {
  account: Akun & { profileImageObjectUrl?: string }
}
