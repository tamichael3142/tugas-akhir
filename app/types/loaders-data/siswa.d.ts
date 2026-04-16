import {
  Akun,
  Assignment,
  AssignmentSubmission,
  Days,
  Hour,
  JadwalPelajaran,
  Kelas,
  MataPelajaran,
  MataPelajaranAttachment,
  SemesterAjaran,
  TahunAjaran,
} from '@prisma/client'
import { PaginationReturns } from '~/utils/pagination.utils.server'

export type LoaderDataSiswa = {
  user: Akun | null
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
type CurrentTahunAndSemesterAjaran = {
  currentTahunAjaran: (TahunAjaran & { semesterAjaran: SemesterAjaran[] }) | null
  currentSemester: SemesterAjaran | null
}

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

export type LoaderDataSiswaKelasDetailMataPelajaranDetailAttachmentDetail =
  LoaderDataSiswaKelasDetailMataPelajaranDetail & {
    attachment: MataPelajaranAttachment
  }
