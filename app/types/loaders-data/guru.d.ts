import { Akun, Pengumuman } from '@prisma/client'
import { PaginationReturns } from '~/utils/pagination.utils.server'

export type LoaderDataGuru = {
  user: Akun | null
}

/**
 * * Dashboard
 */
// export type LoaderDataGuruIndex = {}

/**
 * * Master Pengumuman
 */
export type LoaderDataGuruMasterPengumuman = {
  pengumumans: PaginationReturns<Pengumuman & { createdBy: Akun | null }>
}

export type LoaderDataGuruMasterPengumumanEdit = {
  pengumuman: Pengumuman | null
}
