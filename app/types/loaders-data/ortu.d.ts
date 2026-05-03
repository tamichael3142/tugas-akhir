import {
  Absensi,
  AbsensiXSiswa,
  Akun,
  AkunChildren,
  JadwalPelajaran,
  Kelas,
  Kompetensi,
  MataPelajaran,
  Pengumuman,
  Penilaian,
  SemesterAjaran,
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
}

/**
 * * Nilai
 */
export type LoaderDataOrtuNilai = OrtuWithChildren &
  CurrentTahunAndSemesterAjaran & {
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
 * * Pengumuman
 */
export type LoaderDataOrtuPengumuman = {
  pengumumans?: PaginationReturns<Pengumuman>
}

export type LoaderDataOrtuPengumumanDetail = {
  pengumuman: Pengumuman
}
