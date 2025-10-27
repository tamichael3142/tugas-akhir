import { TahunAjaran } from '@prisma/client'
import { create } from 'zustand'

type SelectDataStoreType = {
  tahunAjaran: {
    lastFetch: Date | null
    data: TahunAjaran[]
  }
}

const useSelectDataStore = create<SelectDataStoreType>(() => ({
  tahunAjaran: { lastFetch: null, data: [] },
}))

export default useSelectDataStore
