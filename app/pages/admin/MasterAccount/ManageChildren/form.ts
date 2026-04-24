import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { LoaderDataAdminMasterAkunManageChildren } from '~/types/loaders-data/admin'

export const validationSchema = z.object({
  childrenIds: z.array(z.string()),
})

export type AdminMasterAccountManageChildrenFormType = z.infer<typeof validationSchema>

export const resolver = zodResolver(validationSchema)

export const emptyValues: AdminMasterAccountManageChildrenFormType = {
  childrenIds: [],
}

export function translateRawToFormData(
  data: LoaderDataAdminMasterAkunManageChildren['children'],
): AdminMasterAccountManageChildrenFormType {
  return {
    childrenIds: data.map(item => item.id),
  }
}
