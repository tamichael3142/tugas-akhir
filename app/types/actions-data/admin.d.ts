import { Akun, Kelas, TahunAjaran } from '@prisma/client'
import { BaseActionData } from './base-action'
import { AdminDashboardInsertBulkAkunFormType } from '~/pages/admin/Dashboard/form'
import { AdminMasterAccountInsertAkunFormType } from '~/pages/admin/MasterAccount/form-types'
import { AdminMasterTahunAjaranCreateFormType } from '~/pages/admin/MasterTahunAjaran/Create/form'
import { AdminMasterKelasCreateFormType } from '~/pages/admin/MasterKelas/Create/form'

export type ActionDataAdminIndex = BaseActionData & {
  data: {
    // * Success
    deletedCount?: number
    createdAkuns?: Akun[]
    // * Error
    oldFormData?: AdminDashboardInsertBulkAkunFormType
  }
}

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
