import {
  Akun,
  AkunChildren,
  JadwalPelajaran,
  Kelas,
  Kompetensi,
  MataPelajaran,
  Penilaian,
  SemesterAjaran,
  SiswaPerKelasDanSemester,
  TahunAjaran,
} from '@prisma/client'

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
