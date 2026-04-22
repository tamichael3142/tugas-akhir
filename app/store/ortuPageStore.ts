import { ReactNode } from 'react'
import { create } from 'zustand'

type OrtuPageStoreType = {
  title: string | undefined
  openSidebar: boolean
  actions: ReactNode[]
}

const useOrtuPageStore = create<OrtuPageStoreType>(() => ({
  title: undefined,
  openSidebar: false,
  actions: [],
}))

export default useOrtuPageStore
