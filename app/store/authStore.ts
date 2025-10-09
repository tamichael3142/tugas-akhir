import { Akun } from '@prisma/client'
import { create } from 'zustand'

type AuthStoreType = {
  user: Akun | null
  isLoading: boolean
}

const useAuthStore = create<AuthStoreType>(() => ({
  user: null,
  isLoading: false,
}))

export default useAuthStore
