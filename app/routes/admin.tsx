import { Akun } from '@prisma/client'
import { json } from '@remix-run/node'
import { MetaFunction, useLoaderData } from '@remix-run/react'
import constants from '~/constants'
import { prisma } from '~/db.server'
import AdminDashboardLayout from '~/layouts/admin/AdminDashboard'

export const meta: MetaFunction = () => {
  return constants.pageMetas.adminDefault
}

export async function loader() {
  const user = await prisma.akun.findUnique({
    where: { username: 'superadmin' },
  })
  return json({ ...user })
}

export default function AdminRoute() {
  const user = useLoaderData<Akun>()
  console.log(user)

  return <AdminDashboardLayout />
}
