import { Ekstrakulikuler } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruManageEkstrakulikulerDetailDaftarSiswaPage from '~/pages/guru/ManageEkstrakulikuler/Detail/DaftarSiswa'
import { LoaderDataGuruManageEkstrakulikulerDetailDaftarSiswa } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageEkstrakulikuler
}

export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataGuruManageEkstrakulikulerDetailDaftarSiswa> {
  const ekstrakulikulerId = params.ekstrakulikulerId as Ekstrakulikuler['id'] | null

  const ekstrakulikuler = await prisma.ekstrakulikuler.findUnique({
    where: { id: ekstrakulikulerId ?? '' },
    include: {
      tahunAjaran: true,
      pengajar: true,
    },
  })

  const siswaPerEkstrakulikulers = await getPaginatedData({
    request,
    model: prisma.siswaPerEkstrakulikuler,
    options: {
      defaultLimit: 50,
      include: {
        siswa: true,
      },
      where: {
        ekstrakulikulerId: ekstrakulikulerId,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            { siswa: { is: { username: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { nip: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { displayName: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { firstName: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { lastName: { contains: search, mode: 'insensitive' } } } },
            { siswa: { is: { email: { contains: search, mode: 'insensitive' } } } },
          ]
        }

        return where
      },
      orderBy: [{ siswa: { createdAt: 'desc' } }],
    },
  })

  return { ekstrakulikuler, siswaPerEkstrakulikulers } as LoaderDataGuruManageEkstrakulikulerDetailDaftarSiswa
}

export default function GuruManageEkstrakulikulerDetailDaftarSiswaRoute() {
  return <GuruManageEkstrakulikulerDetailDaftarSiswaPage />
}
