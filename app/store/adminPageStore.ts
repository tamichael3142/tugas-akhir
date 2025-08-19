import { create } from 'zustand'

type AdminPageStoreType = {
  title: string
  openSidebar: boolean
}

const useAdminPageStore = create<AdminPageStoreType>(() => ({
  title: 'Dashboard',
  openSidebar: false,
}))

export default useAdminPageStore
