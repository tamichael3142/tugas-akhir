import { Akun, AkunChildren } from '@prisma/client'

export type LoaderDataOrtu = {
  user: Akun | null
}

/**
 * * Dashboard
 */
export type LoaderDataOrtuIndex = {
  user: (Akun & { children?: AkunChildren[] }) | null
}
