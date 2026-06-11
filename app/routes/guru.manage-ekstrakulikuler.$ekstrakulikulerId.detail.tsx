import { Ekstrakulikuler } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruManageEkstrakulikulerDetailPage from '~/pages/guru/ManageEkstrakulikuler/Detail'
import { LoaderDataGuruManageEkstrakulikulerDetail } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageEkstrakulikuler
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataGuruManageEkstrakulikulerDetail> {
  const ekstrakulikulerId = params.ekstrakulikulerId as Ekstrakulikuler['id'] | null

  const ekstrakulikuler = await prisma.ekstrakulikuler.findUnique({
    where: { id: ekstrakulikulerId ?? '' },
    include: {
      tahunAjaran: true,
      pengajar: true,
    },
  })

  return { ekstrakulikuler } as LoaderDataGuruManageEkstrakulikulerDetail
}

export default function GuruManageEkstrakulikulerDetailRoute() {
  return <GuruManageEkstrakulikulerDetailPage />
}
