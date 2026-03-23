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

export type LoaderDataGuruDaftarKelasDetailDaftarSiswa = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
  siswaPerKelasPerSemesters: PaginationReturns<SiswaPerKelasDanSemester & { siswa: Akun | null }>
}

export type LoaderDataGuruDaftarKelasDetailMataPelajaran = {
  kelas: (Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }) | null
  mataPelajarans: PaginationReturns<MataPelajaran & { guru: Akun | null }>
}

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
