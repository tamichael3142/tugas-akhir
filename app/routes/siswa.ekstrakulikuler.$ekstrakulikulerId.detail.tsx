import { Ekstrakulikuler } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import DBUtils from '~/database/utils'
import SiswaEkstrakulikulerDetailPage from '~/pages/siswa/Ekstrakulikuler/Detail'
import { LoaderDataSiswaEkstrakulikulerDetail } from '~/types/loaders-data/siswa'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaEkstrakulikuler
}

export async function loader({ request, params }: LoaderFunctionArgs): Promise<LoaderDataSiswaEkstrakulikulerDetail> {
  const userId = await requireAuthCookie(request)

  const ekstrakulikulerId = params.ekstrakulikulerId as Ekstrakulikuler['id'] | null

  const ekstrakulikuler = await prisma.ekstrakulikuler.findUnique({
    where: { id: ekstrakulikulerId ?? '' },
    include: {
      tahunAjaran: true,
      pengajar: true,
    },
  })

  const kompetensiEkstrakulikulers = await prisma.kompetensiEkstrakulikuler.findMany({
    where: { deletedAt: null },
    orderBy: { sequenceNumber: 'asc' },
  })

  const penilaianEkstrakulikulers = await prisma.penilaianExtrakulikuler.findMany({
    where: {
      ekstrakulikulerId: ekstrakulikulerId ?? undefined,
      siswaId: userId,
    },
  })

  return {
    ekstrakulikuler,
    kompetensiEkstrakulikulers,
    penilaianEkstrakulikulers: [
      ...penilaianEkstrakulikulers.map(item => ({
        ...item,
        nilai: DBUtils.decimal.decimalToNumber(item.nilai),
      })),
    ],
  } as LoaderDataSiswaEkstrakulikulerDetail
}

export default function SiswaEkstrakulikulerDetailRoute() {
  return <SiswaEkstrakulikulerDetailPage />
}
