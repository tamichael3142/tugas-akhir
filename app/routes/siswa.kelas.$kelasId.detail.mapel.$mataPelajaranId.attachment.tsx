import { Kelas, MataPelajaran } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import constants from '~/constants'
import DBHelpers from '~/database/helpers'
import SiswaKelasDetailMataPelajaranDetailAttachmentPage from '~/pages/siswa/Kelas/Detail/MataPelajaran/Detail/Attachment'
import mapelAttachmentStorageManager from '~/storage-manager/mapelAttachment.storageManager.server'
import { LoaderDataSiswaKelasDetailMataPelajaranDetailAttachment } from '~/types/loaders-data/siswa'
import { prisma } from '~/utils/db.server'
import { getPaginatedData } from '~/utils/pagination.utils.server'

export const meta: MetaFunction = () => {
  return constants.pageMetas.siswaMapelAttachment
}
export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderDataSiswaKelasDetailMataPelajaranDetailAttachment> {
  const kelasId = params.kelasId as Kelas['id'] | null
  const mataPelajaranId = params.mataPelajaranId as MataPelajaran['id'] | null

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId ?? '' },
    include: {
      tahunAjaran: {
        include: {
          semesterAjaran: true,
        },
      },
      wali: true,
    },
  })

  const currentTahunAjaran = kelas?.tahunAjaran

  const currentSemesterUrutan = DBHelpers.semesterAjaran.getTodaySemesterAjaranUrutan()
  const currentSemester = DBHelpers.semesterAjaran.getCurrentSemesterAjaranFromTahunAjaran({
    currentSemesterUrutan,
    semesterAjaran: currentTahunAjaran?.semesterAjaran ?? [],
  })

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

  const storageManager = mapelAttachmentStorageManager()

  const attachments = await getPaginatedData({
    request,
    model: prisma.mataPelajaranAttachment,
    options: {
      defaultLimit: 10,
      where: {
        mataPelajaranId,
        kelasId,
      },
      mapQueryToWhere: query => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}

        const search = query.get('search')
        if (search) {
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        }

        return where
      },
      orderBy: [{ createdAt: 'desc' }],
    },
  })

  return {
    kelas,
    currentTahunAjaran,
    currentSemester,
    mataPelajaran,
    attachments: {
      ...attachments,
      data: attachments.data.map(item => ({
        ...item,
        downloadUrl: storageManager.getDownloadUrl({ fullPath: item.path }),
      })),
    },
  } as LoaderDataSiswaKelasDetailMataPelajaranDetailAttachment
}

export default function SiswaKelasDetailMataPelajaranDetailAttachmentRoute() {
  return <SiswaKelasDetailMataPelajaranDetailAttachmentPage />
}
