import {
  Assignment,
  MataPelajaranAttachment,
  MataPelajaranBeritaAcara,
  PelanggaranPerMapel,
  Pengumuman,
} from '@prisma/client'
import { BaseActionData } from './base-action'
import { GuruMasterPengumumanCreateFormType } from '~/pages/guru/MasterPengumuman/form-types'
import { GuruManageAbsensiEditFormType, GuruManageAbsensiMutateFormType } from '~/pages/guru/ManageAbsensi/form-types'
import { GuruManageMataPelajaranDetailAssignmentCreateFormType } from '~/pages/guru/ManageMataPelajaran/Detail/Assignment/Create/form'
import { GuruDaftarKelasDetailMataPelajaranDetailAssignmentCreateFormType } from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Assignment/form-types'
import { GuruDaftarKelasDetailMataPelajaranDetailAttachmentCreateFormType } from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Attachment/form-types'
import { GuruDaftarKelasDetailMataPelajaranDetailPenilaianFormType } from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Penilaian/form'
import { GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateFormType } from '~/pages/guru/DaftarKelas/Detail/MataPelajaran/Detail/Pelanggaran/form-types'

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

export type ActionDataGuruManageAbsensiMutate = BaseActionData & {
  data: {
    // * Error
    oldFormData?: GuruManageAbsensiMutateFormType
  }
}

/**
 * * Daftar Kelas
 */
export type ActionDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraCreate = BaseActionData & {
  data: {
    // * Success
    createdBeritaAcara?: MataPelajaranBeritaAcara
    // * Error
    oldFormData?: GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraCreateFormType
  }
}

export type ActionDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraEdit = BaseActionData & {
  data: {
    // * Success
    updatedBeritaAcara?: MataPelajaranBeritaAcara
    // * Error
    oldFormData?: GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraCreateFormType
  }
}

export type ActionDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentCreate = BaseActionData & {
  data: {
    // * Success
    createdAssignment?: Assignment
    // * Error
    oldFormData?: GuruDaftarKelasDetailMataPelajaranDetailAssignmentCreateFormType
  }
}

export type ActionDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentEdit = BaseActionData & {
  data: {
    // * Success
    updatedAssignment?: Assignment
    // * Error
    oldFormData?: GuruDaftarKelasDetailMataPelajaranDetailAssignmentCreateFormType
  }
}

export type ActionDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentCreate = BaseActionData & {
  data: {
    // * Success
    createdAttachment?: MataPelajaranAttachment
    // * Error
    oldFormData?: GuruDaftarKelasDetailMataPelajaranDetailAttachmentCreateFormType
  }
}

export type ActionDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentEdit = BaseActionData & {
  data: {
    // * Success
    updatedAttachment?: MataPelajaranAttachment
    // * Error
    oldFormData?: GuruDaftarKelasDetailMataPelajaranDetailAttachmentCreateFormType
  }
}

export type ActionDataGuruDaftarKelasDetailMataPelajaranDetailAttachmentDelete = BaseActionData & {
  data: {
    // * Success
    deletedAttachment?: MataPelajaranAttachment
  }
}

export type ActionDataGuruDaftarKelasDetailMataPelajaranDetailPenilaian = BaseActionData & {
  data: {
    // * Error
    oldFormData?: GuruDaftarKelasDetailMataPelajaranDetailPenilaianFormType
  }
}

export type ActionDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreate = BaseActionData & {
  data: {
    // * Success
    createdPelanggaran?: PelanggaranPerMapel
    // * Error
    oldFormData?: GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateFormType
  }
}

export type ActionDataGuruDaftarKelasDetailMataPelajaranDetailPelanggaranEdit = BaseActionData & {
  data: {
    // * Success
    updatedPelanggaran?: PelanggaranPerMapel
    // * Error
    oldFormData?: GuruDaftarKelasDetailMataPelajaranDetailPelanggaranCreateFormType
  }
}

/**
 * * Manage Mata Pelajaran
 */
export type ActionDataGuruManageMataPelajaranDetailAssignmentCreate = BaseActionData & {
  data: {
    // * Success
    createdAssignment?: Assignment
    // * Error
    oldFormData?: GuruManageMataPelajaranDetailAssignmentCreateFormType
  }
}

export type ActionDataGuruManageMataPelajaranDetailAssignmentEdit = BaseActionData & {
  data: {
    // * Success
    updatedAssignment?: Assignment
    // * Error
    oldFormData?: GuruManageMataPelajaranDetailAssignmentCreateFormType
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
