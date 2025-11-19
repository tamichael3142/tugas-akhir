import {
  Akun,
  Ekstrakulikuler,
  Kelas,
  MataPelajaran,
  Pengumuman,
  SemesterAjaran,
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
 * * Master Tahun Ajaran
 */
export type LoaderDataAdminMasterTahunAjaran = {
  tahunAjarans: PaginationReturns<TahunAjaran>
}

export type LoaderDataAdminMasterTahunAjaranEdit = {
  tahunAjaran: TahunAjaran | null
}

/**
 * * Master Kelas
 */
export type LoaderDataAdminMasterKelas = {
  tahunAjarans: TahunAjaran[]
  waliKelass: Akun[]
  kelass: PaginationReturns<Kelas & { tahunAjaran: TahunAjaran; wali: Akun | null }>
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

/**
 * * Master Mata Pelajaran
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

/**
 * * Master Pengumuman
 */
export type LoaderDataAdminMasterPengumuman = {
  pengumumans: PaginationReturns<Pengumuman>
}

export type LoaderDataAdminMasterPengumumanEdit = {
  pengumuman: Pengumuman | null
}

/**
 * * Master Account
 */
export type LoaderDataAdminMasterAkun = {
  akuns: PaginationReturns<Akun>
}

export type LoaderDataAdminMasterAkunEdit = {
  akun: Akun | null
}
