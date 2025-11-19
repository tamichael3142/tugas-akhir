import { Akun, Ekstrakulikuler, Kelas, MataPelajaran, Pengumuman, TahunAjaran } from '@prisma/client'
import { BaseActionData } from './base-action'
import { AdminDashboardInsertBulkAkunFormType } from '~/pages/admin/Dashboard/form'
import { AdminMasterAccountInsertAkunFormType } from '~/pages/admin/MasterAccount/form-types'
import { AdminMasterTahunAjaranCreateFormType } from '~/pages/admin/MasterTahunAjaran/Create/form'
import { AdminMasterKelasCreateFormType } from '~/pages/admin/MasterKelas/Create/form'

/**
 * * Dashboard
 */
export type ActionDataAdminIndex = BaseActionData & {
  data: {
    // * Success
    deletedCount?: number
    createdAkuns?: Akun[]
    // * Error
    oldFormData?: AdminDashboardInsertBulkAkunFormType
  }
}

/**
 * * Master Tahun Ajaran
 */
export type ActionDataAdminMasterTahunAjaranCreate = BaseActionData & {
  data: {
    // * Success
    createdTahunAjaran?: TahunAjaran
    // * Error
    oldFormData?: AdminMasterTahunAjaranCreateFormType
  }
}

export type ActionDataAdminMasterTahunAjaranEdit = BaseActionData & {
  data: {
    // * Success
    updatedTahunAjaran?: TahunAjaran
    // * Error
    oldFormData?: AdminMasterTahunAjaranCreateFormType
  }
}

export type ActionDataAdminMasterTahunAjaranDelete = BaseActionData & {
  data: {
    // * Success
    deletedTahunAjaran?: TahunAjaran
  }
}

/**
 * * Master Kelas
 */
export type ActionDataAdminMasterKelasCreate = BaseActionData & {
  data: {
    // * Success
    createdKelas?: Kelas
    // * Error
    oldFormData?: AdminMasterKelasCreateFormType
  }
}

export type ActionDataAdminMasterKelasEdit = BaseActionData & {
  data: {
    // * Success
    updatedKelas?: Kelas
    // * Error
    oldFormData?: AdminMasterKelasCreateFormType
  }
}

export type ActionDataAdminMasterKelasDelete = BaseActionData & {
  data: {
    // * Success
    deletedKelas?: Kelas
  }
}

/**
 * * Master Mata Pelajaran
 */
export type ActionDataAdminMasterMataPelajaranCreate = BaseActionData & {
  data: {
    // * Success
    createdMataPelajaran?: MataPelajaran
    // * Error
    oldFormData?: AdminMasterMataPelajaranCreateFormType
  }
}

export type ActionDataAdminMasterMataPelajaranEdit = BaseActionData & {
  data: {
    // * Success
    updatedMataPelajaran?: MataPelajaran
    // * Error
    oldFormData?: AdminMasterMataPelajaranCreateFormType
  }
}

export type ActionDataAdminMasterMataPelajaranDelete = BaseActionData & {
  data: {
    // * Success
    deletedMataPelajaran?: MataPelajaran
  }
}

/**
 * * Master Ekstrakulikuler
 */
export type ActionDataAdminMasterEkstrakulikulerCreate = BaseActionData & {
  data: {
    // * Success
    createdEkstrakulikuler?: Ekstrakulikuler
    // * Error
    oldFormData?: AdminMasterEkstrakulikulerCreateFormType
  }
}

export type ActionDataAdminMasterEkstrakulikulerEdit = BaseActionData & {
  data: {
    // * Success
    updatedEkstrakulikuler?: Ekstrakulikuler
    // * Error
    oldFormData?: AdminMasterEkstrakulikulerCreateFormType
  }
}

export type ActionDataAdminMasterEkstrakulikulerDelete = BaseActionData & {
  data: {
    // * Success
    deletedEkstrakulikuler?: Ekstrakulikuler
  }
}

/**
 * * Master Pengumuman
 */
export type ActionDataAdminMasterPengumumanCreate = BaseActionData & {
  data: {
    // * Success
    createdPengumuman?: Pengumuman
    // * Error
    oldFormData?: AdminMasterPengumumanCreateFormType
  }
}

export type ActionDataAdminMasterPengumumanEdit = BaseActionData & {
  data: {
    // * Success
    updatedPengumuman?: Pengumuman
    // * Error
    oldFormData?: AdminMasterPengumumanCreateFormType
  }
}

export type ActionDataAdminMasterPengumumanDelete = BaseActionData & {
  data: {
    // * Success
    deletedPengumuman?: Pengumuman
  }
}

/**
 * * Master Account
 */
export type ActionDataAdminMasterAccountCreate = BaseActionData & {
  data: {
    // * Success
    createdAkun?: Akun
    // * Error
    oldFormData?: AdminMasterAccountInsertAkunFormType
  }
}

export type ActionDataAdminMasterAccountEdit = BaseActionData & {
  data: {
    // * Success
    updatedAkun?: Akun
    // * Error
    oldFormData?: AdminMasterAccountInsertAkunFormType
  }
}

export type ActionDataAdminMasterAccountDelete = BaseActionData & {
  data: {
    // * Success
    deletedAkun?: Akun
  }
}
