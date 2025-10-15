import { Akun, TahunAjaran, TempAkun } from '@prisma/client'
import { PaginationReturns } from '~/utils/pagination.utils.server'

export type LoaderDataAdmin = {
  user: Akun | null
}

export type LoaderDataAdminIndex = {
  tempAkuns: TempAkun[]
}

export type LoaderDataAdminMasterTahunAjaran = {
  tahunAjarans: PaginationReturns<TahunAjaran>
}

export type LoaderDataAdminMasterTahunAjaranEdit = {
  tahunAjaran: TahunAjaran | null
}

export type LoaderDataAdminMasterAkun = {
  akuns: PaginationReturns<Akun>
}

export type LoaderDataAdminMasterAkunEdit = {
  akun: Akun | null
}
