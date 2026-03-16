import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruManageAbsensiPage from '~/pages/guru/ManageAbsensi'
import { LoaderDataGuruManageAbsensi } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageAbsensi
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataGuruManageAbsensi> {
  const absensis = await getPaginatedData({
    request,
    model: prisma.absensi,
    options: {
      defaultLimit: 10,
      orderBy: [{ tanggal: 'desc' }, { createdAt: 'desc' }],
    },
  })

  return {
    absensis,
  } as LoaderDataGuruManageAbsensi
}

export default function GuruManageAbsensiRoute() {
  return <GuruManageAbsensiPage />
}
