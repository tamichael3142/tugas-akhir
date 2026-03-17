import { zodResolver } from '@hookform/resolvers/zod'
import { AbsensiXSiswa, Akun, SiswaPerKelasDanSemester } from '@prisma/client'
import * as z from 'zod'
import { TipeAbsensi } from '~/database/enums/prisma.enums'

export const validaionSchema = z.object({
  siswaTerabsen: z.array(
    z.object({
      id: z.string().nullish(),
      siswaId: z.string().nullish(),
      tipe: z.enum(TipeAbsensi).default(TipeAbsensi.HADIR),
    }),
  ),
})

export type GuruManageAbsensiMutateFormType = z.infer<typeof validaionSchema>

export const resolver = zodResolver(validaionSchema)

export const emptyUserValue: GuruManageAbsensiMutateFormType = {
  siswaTerabsen: [],
}

export function translateRawToFormData(data: {
  siswaTerabsen: AbsensiXSiswa[]
  siswaPerKelasPerSemesters: (SiswaPerKelasDanSemester & { siswa: Akun | null })[]
}): GuruManageAbsensiMutateFormType {
  const results: GuruManageAbsensiMutateFormType['siswaTerabsen'] = []

  for (let i = 0; i < data.siswaPerKelasPerSemesters.length; i++) {
    const siswaPerKelas = data.siswaPerKelasPerSemesters[i]
    const existingTerabsen = data.siswaTerabsen.find(item => item.siswaId === siswaPerKelas.siswaId)
    if (existingTerabsen) {
      // * Sudah ada data di BE
      results.push({
        id: String(existingTerabsen.id),
        siswaId: existingTerabsen.siswaId,
        tipe: existingTerabsen.tipe as TipeAbsensi,
      })
    } else {
      // * Belum ada data di BE
      results.push({
        id: null,
        siswaId: siswaPerKelas.siswaId,
        tipe: TipeAbsensi.UNKNOWN,
      })
    }
  }

  return {
    siswaTerabsen: results,
  }
}
