import { ReactNode } from 'react'
import { create } from 'zustand'

type AdminPageStoreType = {
  title: string | undefined
  openSidebar: boolean
  actions: ReactNode[]
}

const useAdminPageStore = create<AdminPageStoreType>(() => ({
  title: undefined,
  openSidebar: false,
  actions: [],
}))

export default useAdminPageStore
