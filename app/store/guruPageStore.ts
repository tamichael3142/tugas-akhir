import { ReactNode } from 'react'
import { create } from 'zustand'

type GuruPageStoreType = {
  title: string | undefined
  openSidebar: boolean
  actions: ReactNode[]
}

const useGuruPageStore = create<GuruPageStoreType>(() => ({
  title: undefined,
  openSidebar: false,
  actions: [],
}))

export default useGuruPageStore
