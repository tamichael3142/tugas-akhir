import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import { requireAuthCookie } from '~/utils/auth.utils'
import { LoaderFunctionArgs } from '@remix-run/node'
import { prisma } from '~/utils/db.server'
import { LoaderDataOrtuIndex } from '~/types/loaders-data/ortu'
import OrtuDashboardPage from '~/pages/ortu/Dashboard'

export const meta: MetaFunction = () => {
  return constants.pageMetas.ortuDashboard
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderDataOrtuIndex> {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({
    where: { id: userId },
    include: {
      children: { include: { siswa: true } },
    },
  })

  let currentTahunAjaran = await prisma.tahunAjaran.findFirst({
    where: {
      tahunMulai: { lte: new Date() },
      tahunBerakhir: { gte: new Date() },
      deletedAt: null,
    },
  })

  if (!currentTahunAjaran)
    currentTahunAjaran = await prisma.tahunAjaran.findFirst({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })

  return { user: currUser, currentTahunAjaran }
}

export default function OrtuDashboardRoute() {
  return <OrtuDashboardPage />
}
