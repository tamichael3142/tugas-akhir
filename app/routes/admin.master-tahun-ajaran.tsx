import { useEffect } from 'react'
import useAdminPageStore from '~/store/adminPageStore'

export default function AdminMasterTahunAjaranRoute() {
  useEffect(() => {
    useAdminPageStore.setState({ title: 'Master Tahun Ajaran' })
  }, [])

  return <div>{'Admin > Master Tahun Ajaran'}</div>
}
