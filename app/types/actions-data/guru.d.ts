import { Pengumuman } from '@prisma/client'
import { BaseActionData } from './base-action'
import { GuruMasterPengumumanCreateFormType } from '~/pages/guru/MasterPengumuman/form-types'
import { GuruManageAbsensiEditFormType } from '~/pages/guru/ManageAbsensi/form-types'

/**
 * * Manage Absensi
 */
export type ActionDataGuruManageAbsensiEdit = BaseActionData & {
  data: {
    // * Success
    updatedAbsensi?: Absensi
    // * Error
    oldFormData?: GuruManageAbsensiEditFormType
  }
}

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
