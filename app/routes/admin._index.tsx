import { useEffect } from 'react'
import useAdminPageStore from '~/store/adminPageStore'

export default function AdminIndexRoute() {
  useEffect(() => {
    useAdminPageStore.setState({ title: 'Dashboard' })
  }, [])

  return <div>{'Admin > Dashboard'}</div>
}
