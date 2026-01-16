import { Pengumuman } from '@prisma/client'
import { BaseActionData } from './base-action'

/**
 * * Master Pengumuman
 */
export type ActionDataGuruMasterPengumumanCreate = BaseActionData & {
  data: {
    // * Success
    createdPengumuman?: Pengumuman
    // * Error
    oldFormData?: GuruMasterPengumumanCreateFormType
  }
}

export type ActionDataGuruMasterPengumumanEdit = BaseActionData & {
  data: {
    // * Success
    updatedPengumuman?: Pengumuman
    // * Error
    oldFormData?: GuruMasterPengumumanCreateFormType
  }
}

export type ActionDataGuruMasterPengumumanDelete = BaseActionData & {
  data: {
    // * Success
    deletedPengumuman?: Pengumuman
  }
}
