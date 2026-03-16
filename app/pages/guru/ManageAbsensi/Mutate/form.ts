import { zodResolver } from '@hookform/resolvers/zod'
import { Absensi, AbsensiXSiswa } from '@prisma/client'
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

export function translateRawToFormData(
  data: Absensi & { siswaTerabsen: AbsensiXSiswa[] },
): GuruManageAbsensiMutateFormType {
  return {
    siswaTerabsen: data.siswaTerabsen.map(item => ({
      id: String(item.id),
      siswaId: item.siswaId,
      tipe: item.tipe as TipeAbsensi,
    })),
  }
}
