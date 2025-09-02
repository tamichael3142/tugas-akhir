import { Akun } from '@prisma/client'
import { MetaFunction, useLoaderData } from '@remix-run/react'
import constants from '~/constants'
import { prisma } from '~/utils/db.server'
import AdminDashboardLayout from '~/layouts/admin/AdminDashboard'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminDefault
}

export async function loader() {
  // await prisma.akun
  //   .create({ data: { username: 'superadmin', password: 'superadmin' } })
  //   .then(res => console.log('success', res))
  const user = await prisma.akun.findUnique({
    where: { username: 'superadmin' },
  })
  return { user }
}

export default function AdminRoute() {
  const loader = useLoaderData<{ user: Akun }>()
  console.log(loader.user)

  return <AdminDashboardLayout />
}
