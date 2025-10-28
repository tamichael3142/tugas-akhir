import { Akun, Kelas, TahunAjaran, TempAkun } from '@prisma/client'
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
 * * Master Kelas
 */
export type LoaderDataAdminMasterMataPelajaran = {
  tahunAjarans: TahunAjaran[]
  kelass: PaginationReturns<Kelas & { tahunAjaran: TahunAjaran }>
}

export type LoaderDataAdminMasterMataPelajaranCreate = {
  tahunAjarans: TahunAjaran[]
}

export type LoaderDataAdminMasterMataPelajaranEdit = {
  tahunAjarans: TahunAjaran[]
  kelas: (Kelas & { tahunAjaran: TahunAjaran }) | null
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
