import { ActionFunctionArgs } from '@remix-run/node'
import { getValidatedFormData } from 'remix-hook-form'
import AdminIndexPage from '~/pages/admin/Dashboard'
import { FormType, resolver } from '~/pages/admin/Dashboard/form'

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
