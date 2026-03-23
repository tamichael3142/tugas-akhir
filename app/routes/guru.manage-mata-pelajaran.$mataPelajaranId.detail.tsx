import { Kelas } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import GuruMataPelajaranDetailPage from '~/pages/guru/ManageMataPelajaran/Detail'
import { LoaderDataGuruManageMataPelajaranDetail } from '~/types/loaders-data/guru'
import { prisma } from '~/utils/db.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruManageMataPelajaran
}
export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderDataGuruManageMataPelajaranDetail> {
  const mataPelajaranId = params.mataPelajaranId as Kelas['id'] | null

  const mataPelajaran = await prisma.mataPelajaran.findUnique({
    where: { id: mataPelajaranId ?? '' },
    include: {
      semesterAjaran: {
        include: {
          tahunAjaran: true,
        },
      },
      guru: true,
    },
  })

  return { mataPelajaran } as LoaderDataGuruManageMataPelajaranDetail
}

export default function GuruManageMataPelajaranDetailRoute() {
  return <GuruMataPelajaranDetailPage />
}
