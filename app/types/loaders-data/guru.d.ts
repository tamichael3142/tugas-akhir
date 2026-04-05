import {
  Absensi,
  AbsensiXSiswa,
  Akun,
  Days,
  Hour,
  JadwalPelajaran,
  Kelas,
  MataPelajaran,
  Pengumuman,
  SemesterAjaran,
  SiswaPerKelasDanSemester,
  TahunAjaran,
  Assignment,
  MataPelajaranAttachment,
  Kompetensi,
  Penilaian,
  PelanggaranPerMapel,
} from '@prisma/client'
import { PaginationReturns } from '~/utils/pagination.utils.server'

export type LoaderDataGuru = {
  user: Akun | null
}

/**
 * * Dashboard
 */
// export type LoaderDataGuruIndex = {}

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
 * * Daftar Kelas
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
 * * Daftar Kelas Detail > Daftar Siswa
 */
export type LoaderDataGuruDaftarKelasDetailDaftarSiswa = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
  siswaPerKelasPerSemesters: PaginationReturns<SiswaPerKelasDanSemester & { siswa: Akun | null }>
}

/**
 * * Daftar Kelas Detail > Mata Pelajaran
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
 * * Daftar Kelas Detail > Mata Pelajaran Detail > Assignment
 */
export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignment =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    assignments: PaginationReturns<Assignment>
  }

export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentCreate =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail

export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentEdit =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    assignment: Assignment
  }

/**
 * * Daftar Kelas Detail > Mata Pelajaran Detail > Attachment
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
 * * Daftar Kelas Detail > Mata Pelajaran Detail > Penilaian
 */
export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPenilaian =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    kompetensis: Kompetensi[]
    siswaPerKelasPerSemesters: (SiswaPerKelasDanSemester & { siswa: Akun | null })[]
    penilaians: Penilaian[]
  }

/**
 * * Daftar Kelas Detail > Mata Pelajaran Detail > Pelanggaram
 */
export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaran =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    pelanggarans: PaginationReturns<PelanggaranPerMapel & { siswa: Akun }>
  }

export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreate =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    siswas: Akun[]
  }

export type LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranEdit =
  LoaderDataGuruDaftarKelasDetailMataPelajaranDetail & {
    siswas: Akun[]
    pelanggaran: PelanggaranPerMapel & { siswa: Akun }
  }

/**
 * * Daftar Kelas Detail > Absensi
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
 * * Manage Mata Pelajaran
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
  absensis: PaginationReturns<Absensi>
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
 * * Master Pengumuman
 */
export type LoaderDataGuruMasterPengumuman = {
  pengumumans: PaginationReturns<Pengumuman & { createdBy: Akun | null }>
}

export type LoaderDataGuruMasterPengumumanEdit = {
  pengumuman: Pengumuman | null
}
