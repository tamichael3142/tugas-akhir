import {
  Absensi,
  AbsensiXSiswa,
  Akun,
  AkunChildren,
  Days,
  Ekstrakulikuler,
  Hour,
  JadwalPelajaran,
  Kelas,
  Kompetensi,
  MataPelajaran,
  Pengumuman,
  Penilaian,
  SemesterAjaran,
  SiswaPerEkstrakulikuler,
  SiswaPerKelasDanSemester,
  TahunAjaran,
  TempAkun,
} from '@prisma/client'
import { PaginationReturns } from '~/utils/pagination.utils.server'

export type LoaderDataAdmin = {
  user: Akun | null
}

/**
 * * Dashboard
 */
export type LoaderDataAdminIndex = {
  tempAkuns: TempAkun[]
}

/**
 * * Master Academic Year
 */
export type LoaderDataAdminMasterTahunAjaran = {
  tahunAjarans: PaginationReturns<TahunAjaran>
}

export type LoaderDataAdminMasterTahunAjaranEdit = {
  tahunAjaran: TahunAjaran | null
}

/**
 * * Master Class
 */
export type LoaderDataAdminMasterKelas = {
  tahunAjarans: TahunAjaran[]
  waliKelass: Akun[]
  kelass: PaginationReturns<
    Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }; wali: Akun | null }
  >
}

export type LoaderDataAdminMasterKelasCreate = {
  tahunAjarans: TahunAjaran[]
  gurus: Akun[]
}

export type LoaderDataAdminMasterKelasEdit = {
  tahunAjarans: TahunAjaran[]
  gurus: Akun[]
  kelas: (Kelas & { tahunAjaran: TahunAjaran; wali: Akun | null }) | null
}

export type LoaderDataAdminMasterKelasManageJadwal = {
  kelas:
    | (Kelas & {
        tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }
        wali: Akun | null
        jadwalPelajarans: JadwalPelajaran[]
      })
    | null
  days: Days[]
  hours: Hour[]
  mataPelajarans: MataPelajaran[]
}

export type LoaderDataAdminMasterKelasManageSiswa = {
  kelas:
    | (Kelas & {
        tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }
        wali: Akun | null
      })
    | null
  siswaPerKelasPerSemesters: PaginationReturns<SiswaPerKelasDanSemester & { siswa: Akun | null }>
}

export type LoaderDataAdminMasterKelasAddSiswa = {
  kelas:
    | (Kelas & {
        tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }
        wali: Akun | null
      })
    | null
  siswaPerKelasPerSemesters: (SiswaPerKelasDanSemester & { semesterAjaran: SemesterAjaran | null })[]
  availableSiswas: PaginationReturns<Akun>
}

export type LoaderDataAdminMasterKelasPenilaian = {
  kelas: Kelas & {
    tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }
    wali: Akun | null
    siswaPerKelasDanSemester: (SiswaPerKelasDanSemester & { siswa: Akun })[]
  }
  mataPelajarans: (MataPelajaran & {
    penilaians: Penilaian[]
  })[]
  kompetensis: Kompetensi[]
}

export type LoaderDataAdminMasterKelasAbsensi = {
  kelas: Kelas & {
    tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] }
    wali: Akun | null
    siswaPerKelasDanSemester: (SiswaPerKelasDanSemester & { siswa: Akun })[]
  }
  absensis?: (Absensi & { siswaTerabsen: AbsensiXSiswa[] })[]
}

/**
 * * Master Subject
 */
export type LoaderDataAdminMasterMataPelajaran = {
  tahunAjarans: (TahunAjaran & { semesterAjaran: SemesterAjaran[] })[]
  gurus: Akun[]
  mataPelajarans: PaginationReturns<
    MataPelajaran & { semesterAjaran: SemesterAjaran & { tahunAjaran: TahunAjaran }; guru: Akun | null }
  >
}

export type LoaderDataAdminMasterMataPelajaranCreate = {
  tahunAjarans: (TahunAjaran & { semesterAjaran: SemesterAjaran[] })[]
  gurus: Akun[]
}

export type LoaderDataAdminMasterMataPelajaranEdit = {
  tahunAjarans: (TahunAjaran & { semesterAjaran: SemesterAjaran[] })[]
  gurus: Akun[]
  mataPelajaran:
    | (MataPelajaran & { semesterAjaran: SemesterAjaran & { tahunAjaran: TahunAjaran }; guru: Akun | null })
    | null
}

/**
 * * Master Ekstrakulikuler
 */
export type LoaderDataAdminMasterEkstrakulikuler = {
  tahunAjarans: TahunAjaran[]
  pengajars: Akun[]
  ekstrakulikulers: PaginationReturns<Ekstrakulikuler & { tahunAjaran: TahunAjaran; pengajar: Akun | null }>
}

export type LoaderDataAdminMasterEkstrakulikulerCreate = {
  tahunAjarans: TahunAjaran[]
  pengajars: Akun[]
}

export type LoaderDataAdminMasterEkstrakulikulerEdit = {
  tahunAjarans: TahunAjaran[]
  pengajars: Akun[]
  ekstrakulikuler: (Ekstrakulikuler & { tahunAjaran: TahunAjaran; pengajar: Akun | null }) | null
}

export type LoaderDataAdminMasterEkstrakulikulerManageSiswa = {
  ekstrakulikuler: (Ekstrakulikuler & { tahunAjaran: TahunAjaran; pengajar: Akun | null }) | null
  siswaPerEkstrakulikulers: PaginationReturns<SiswaPerEkstrakulikuler & { siswa: Akun | null }>
}

export type LoaderDataAdminMasterEkstrakulikulerAddSiswa = {
  ekstrakulikuler: (Ekstrakulikuler & { tahunAjaran: TahunAjaran; pengajar: Akun | null }) | null
  existingSiswaPerEkstrakulikulers: SiswaPerEkstrakulikuler[]
  availableSiswas: PaginationReturns<Akun>
}

/**
 * * Master Announcement
 */
export type LoaderDataAdminMasterPengumuman = {
  pengumumans: PaginationReturns<Pengumuman & { createdBy: AKun | null }>
}

export type LoaderDataAdminMasterPengumumanEdit = {
  pengumuman: Pengumuman | null
}

/**
 * * Master Account
 */
export type LoaderDataAdminMasterAkun = {
  akuns: PaginationReturns<Akun & { parents: (AkunChildren & { parent: Akun })[] }>
}

export type LoaderDataAdminMasterAkunEdit = {
  akun: Akun | null
}

export type LoaderDataAdminMasterAkunManageChildren = {
  children: Akun[]
  akuns: PaginationReturns<Akun>
}

/**
 * * Account
 */
export type LoaderDataAdminAccount = {
  account: Akun & { profileImageObjectUrl?: string }
}

export type LoaderDataAdminAccountChangePassword = LoaderDataAdminAccount
