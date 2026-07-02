import {
  Absensi,
  AbsensiXSiswa,
  Akun,
  AkunChildren,
  Ekstrakulikuler,
  JadwalPelajaran,
  Kelas,
  Kompetensi,
  KompetensiEkstrakulikuler,
  PelanggaranPerKelas,
  Pengumuman,
  Penilaian,
  PenilaianExtrakulikuler,
  SemesterAjaran,
  SiswaPerEkstrakulikuler,
  SiswaPerKelasDanSemester,
  TahunAjaran,
} from '@prisma/client'
import { PaginationReturns } from '~/utils/pagination.utils.server'

export type LoaderDataOrtu = {
  user: Akun | null
}

type OrtuWithChildren = {
  user: Akun & { children?: (AkunChildren & { siswa: Akun })[] }
}

export type CurrentTahunAndSemesterAjaran = {
  currentTahunAjaran: (TahunAjaran & { semesterAjaran: SemesterAjaran[] }) | null
  currentSemester: SemesterAjaran | null
}

/**
 * * Dashboard
 */
export type LoaderDataOrtuIndex = {
  user: OrtuWithChildren['user'] | null
  currentTahunAjaran: TahunAjaran | null
}

/**
 * * Nilai
 */
export type LoaderDataOrtuNilai = OrtuWithChildren &
  CurrentTahunAndSemesterAjaran & {
    tahunAjarans: (TahunAjaran & { semesterAjaran: SemesterAjaran[] })[]
    kompetensis: Kompetensi[]
    kompetensiEkstrakulikulers: KompetensiEkstrakulikuler[]
    penilaianEkstrakulikulers: (PenilaianExtrakulikuler & { nilai: number })[]
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
          siswaPerEkstrakulikuler: (SiswaPerEkstrakulikuler & {
            ekstrakulikuler: Ekstrakulikuler
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

export type LoaderDataOrtuAbsensi = OrtuWithChildren &
  CurrentTahunAndSemesterAjaran & {
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
export type LoaderDataOrtuPengumuman = {
  pengumumans?: PaginationReturns<Pengumuman>
}

export type LoaderDataOrtuPengumumanDetail = {
  pengumuman: Pengumuman
}

/**
 * * Account
 */
export type LoaderDataOrtuAccount = {
  account: Akun & { profileImageObjectUrl?: string }
}

export type LoaderDataOrtuAccountChangePassword = LoaderDataOrtuAccount

/**
 * * Violations
 */
export type LoaderDataOrtuViolations = OrtuWithChildren & {
  pelanggarans: PaginationReturns<PelanggaranPerKelas & { siswa: Akun; kelas: Kelas; createdBy: Akun | null }>
  totalPoint: number
}
