import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import AdminDashboardPage from '~/layouts/admin/adminDashboard'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminDefault
}

export default function AdminRoute() {
  return <AdminDashboardPage />
}
