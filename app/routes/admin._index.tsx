import { ActionFunctionArgs } from '@remix-run/node'
import { getValidatedFormData } from 'remix-hook-form'
import AdminIndexPage from '~/pages/admin/Dashboard'
import { FormType, resolver } from '~/pages/admin/Dashboard/form'
import { LoaderDataAdminIndex } from '~/types/loaders-data/admin'
import { prisma } from '~/utils/db.server'

export async function loader() {
  const tempAkuns = await prisma.tempAkun.findMany().catch(error => {
    console.log(error)
    return []
  })
  const response: LoaderDataAdminIndex = { tempAkuns }

  return response
}

export async function action({ request }: ActionFunctionArgs) {
  const { errors, data, receivedValues: defaultValues } = await getValidatedFormData<FormType>(request, resolver)
  if (errors) {
    // The keys "errors" and "defaultValues" are picked up automatically by useRemixForm
    console.log(data)
    return { errors, defaultValues }
  }

  // Do something with the data
  return data
}

export default function AdminIndexRoute() {
  return <AdminIndexPage />
}
