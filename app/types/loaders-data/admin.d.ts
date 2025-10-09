import { Akun, TempAkun } from '@prisma/client'
import { PaginationReturns } from '~/utils/pagination.utils.server'

export type LoaderDataAdmin = {
  user: Akun | null
}

export type LoaderDataAdminIndex = {
  tempAkuns: TempAkun[]
}

export type LoaderDataAdminMasterAkun = {
  akuns: PaginationReturns<Akun>
}
