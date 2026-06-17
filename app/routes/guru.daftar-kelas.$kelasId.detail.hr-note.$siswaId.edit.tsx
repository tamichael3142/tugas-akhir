import { Akun, Kelas } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import constants from '~/constants'
import GuruHomeroomNotesEditPage from '~/pages/guru/DaftarKelas/Detail/HomeroomNotes/Edit'
import { GuruHomeroomNoteEditFormType, resolver } from '~/pages/guru/DaftarKelas/Detail/HomeroomNotes/Edit/form'
import { ActionDataGuruHomeroomNotesEdit } from '~/types/actions-data/guru'
import { LoaderDataGuruHomeroomNotesEdit } from '~/types/loaders-data/guru'
import { requireAuthCookie } from '~/utils/auth.utils'
import { prisma } from '~/utils/db.server'
import { prismaErrorHandler } from '~/utils/prisma-error.utils'

export const meta: MetaFunction = () => {
  return constants.pageMetas.guruHomeroomNotesEdit
}

export async function loader({ params, request }: LoaderFunctionArgs): Promise<LoaderDataGuruHomeroomNotesEdit> {
  const kelasId = params.kelasId as Kelas['id']
  const siswaId = params.siswaId as Akun['id']
  const url = new URL(request.url)
  const semesterAjaranId = url.searchParams.get('semesterAjaranId')

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId },
    include: {
      tahunAjaran: { include: { semesterAjaran: true } },
      wali: true,
    },
  })

  const siswa = await prisma.akun.findUnique({ where: { id: siswaId } })

  const studentReport =
    siswaId && semesterAjaranId
      ? await prisma.studentReport.findUnique({
          where: { siswaId_semesterAjaranId: { siswaId, semesterAjaranId } },
        })
      : null

  return { kelas, siswa, studentReport, semesterAjaranId }
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionDataGuruHomeroomNotesEdit> {
  const { errors, data } = await getValidatedFormData<GuruHomeroomNoteEditFormType>(request, resolver)
  if (errors) {
    return { success: false, error: errors, data: {} }
  }

  await requireAuthCookie(request)

  try {
    const { siswaId, semesterAjaranId, homeroomTeacherNote } = data

    await prisma.studentReport.upsert({
      where: { siswaId_semesterAjaranId: { siswaId, semesterAjaranId } },
      create: { siswaId, semesterAjaranId, homeroomTeacherNote: homeroomTeacherNote ?? null },
      update: { homeroomTeacherNote: homeroomTeacherNote ?? null, updatedAt: new Date() },
    })

    return { success: true, message: 'Homeroom note saved!', data: {} }
  } catch (error) {
    const prismaError = prismaErrorHandler(error)
    return {
      success: false,
      error: prismaError,
      message: (prismaError as { message?: string }).message ?? 'Unknown Error!',
      data: {},
    }
  }
}

export default function GuruHomeroomNotesEditRoute() {
  return <GuruHomeroomNotesEditPage />
}
