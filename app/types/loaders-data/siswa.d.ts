import {
  Absensi,
  AbsensiXSiswa,
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
  SiswaPerKelasDanSemester,
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
  days?: Days[]
  hours?: Hour[]
  jadwalPelajarans?: (JadwalPelajaran & { mataPelajaran: MataPelajaran | null; kelas: Kelas | null })[]
  assignments?: (Assignment & {
    mataPelajaran: MataPelajaran
    kelas: Kelas
  })[]
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
 * * Kelas > Subject
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
 * * Kelas > Subject > Assignment
 */
export type LoaderDataSiswaKelasDetailMataPelajaranDetailAssignment = LoaderDataSiswaKelasDetailMataPelajaranDetail & {
  assignments: PaginationReturns<Assignment>
}

export type LoaderDataSiswaKelasDetailMataPelajaranDetailAssignmentDetail =
  LoaderDataSiswaKelasDetailMataPelajaranDetail & {
    assignment: Assignment & { connectedKompetensi: Kompetensi | null }
    assignmentSubmission: AssignmentSubmission | null
    penilaian: (Penilaian & { nilai: number }) | null
  }

/**
 * * Kelas > Subject > Attachment
 */
export type LoaderDataSiswaKelasDetailMataPelajaranDetailAttachment = LoaderDataSiswaKelasDetailMataPelajaranDetail & {
  attachments: PaginationReturns<MataPelajaranAttachment & { downloadUrl?: string }>
}

/**
 * * Kelas > Subject > Penilaian
 */
export type LoaderDataSiswaKelasDetailMataPelajaranDetailPenilaian = LoaderDataSiswaKelasDetailMataPelajaranDetail & {
  kompetensis: Kompetensi[]
  penilaians: Penilaian[]
  siswa: Akun
}

/**
 * * Kelas > Subject > Pelanggaran
 */
export type LoaderDataSiswaKelasDetailMataPelajaranDetailPelanggaran = LoaderDataSiswaKelasDetailMataPelajaranDetail & {
  pelanggarans: PaginationReturns<PelanggaranPerMapel>
}

/**
 * * Nilai
 */
export type LoaderDataSiswaNilai = CurrentTahunAndSemesterAjaran & {
  kompetensis: Kompetensi[]
  dataSiswa:
    | (Akun & {
        siswaPerKelasDanSemester: (SiswaPerKelasDanSemester & {
          kelas: Kelas & {
            jadwalPelajarans: (JadwalPelajaran & {
              mataPelajaran: MataPelajaran
            })[]
            penilaians: (Penilaian & { nilai: number })[]
          }
        })[]
      })
    | null
}

/**
 * * Absensi
 */
type KelasAbsensiStats = {
  totalHadir: number
  totalIzin: number
  totalSakit: number
  totalTanpaKeterangan: number
}

export type LoaderDataSiswaAbsensi = CurrentTahunAndSemesterAjaran & {
  user: Akun | null
  kelass:
    | (Kelas & {
        absensis: (Absensi & {
          siswaTerabsen: AbsensiXSiswa[]
        })[]
        stats: KelasAbsensiStats
      })[]
    | null
}

/**
 * * Announcement
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

export type LoaderDataSiswaAccountPelanggaran = CurrentTahunAndSemesterAjaran & {
  totalPoint: number
  pelanggarans: PaginationReturns<PelanggaranPerMapel & { kelas: Kelas; mataPelajaran: MataPelajaran }>
}

export type LoaderDataSiswaAccountChangePassword = LoaderDataSiswaAccount
