import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruMasterPengumumanPage from '~/pages/guru/MasterPengumuman'
import { LoaderDataGuruMasterPengumuman } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruMasterPengumuman
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataGuruMasterPengumuman> {
  const pengumumans = await getPaginatedData({
    request,
    model: prisma.pengumuman,
    options: {
      defaultLimit: 10,
      include: { createdBy: true },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    },
  })

  return {
    pengumumans,
  } as LoaderDataGuruMasterPengumuman
}

export default function GuruMasterPengumumanRoute() {
  return <GuruMasterPengumumanPage />
}
