import {
  Akun,
  Days,
  Hour,
  JadwalPelajaran,
  Kelas,
  MataPelajaran,
  Pengumuman,
  SemesterAjaran,
  TahunAjaran,
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
  days?: Days[]
  hours?: Hour[]
  jadwalPelajarans?: (JadwalPelajaran & { mataPelajaran: MataPelajaran | null; kelas: Kelas | null })[]
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
