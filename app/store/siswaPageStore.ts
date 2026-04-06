import { ReactNode } from 'react'
import { create } from 'zustand'

type SiswaPageStoreType = {
  title: string | undefined
  openSidebar: boolean
  actions: ReactNode[]
}

const useSiswaPageStore = create<SiswaPageStoreType>(() => ({
  title: undefined,
  openSidebar: false,
  actions: [],
}))

export default useSiswaPageStore
