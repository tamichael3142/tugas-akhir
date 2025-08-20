import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
// import AdminDashboardLayout from '~/layouts/admin/AdminDashboard'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminDefault
}

export default function AdminRoute() {
  return <div />
}
