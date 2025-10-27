import useSelectDataStore from '~/store/selectDataStore'
import DataSelect, { DataSelectProps } from '..'
import { useEffect } from 'react'

export default function DataSelectTahunAjaran(props: Omit<DataSelectProps, 'options'>) {
  const data = useSelectDataStore(state => state.tahunAjaran.data)
  const lastFetch = useSelectDataStore(state => state.tahunAjaran.lastFetch)

  async function fetchData() {
    // TODO: get data here
  }

  useEffect(() => {
    if (lastFetch === null) fetchData()
  }, [lastFetch])

  return <DataSelect {...props} options={data.map(item => ({ value: item.id, label: item.nama }))} />
}
