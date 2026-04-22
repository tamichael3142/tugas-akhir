import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { LoadingFullScreen } from '~/components/ui'
import AppNav from '~/navigation'
import { prisma } from '~/utils/db.server'
import { requireAuthCookie } from '~/utils/auth.utils'
import akunProfileStorageManager from '~/storage-manager/akunProfile.storageManager.server'

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireAuthCookie(request)
  const currUser = await prisma.akun.findUnique({ where: { id: userId } })

  if (!currUser) return json({ error: 'No user found!' }, { status: 404 })

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) return json({ error: 'No file uploaded' }, { status: 400 })

  const storageManager = akunProfileStorageManager()

  if (currUser.profileImageObjectPath) {
    await storageManager.deleteFile({ fullPath: currUser.profileImageObjectPath })
  }

  const uploadedFileInfo = await storageManager.upload({
    file: file,
    akunId: userId,
  })

  await prisma.akun.update({
    where: { id: userId },
    data: {
      profileImageObjectPath: uploadedFileInfo.path,
      updatedAt: new Date(),
      lastUpdateById: userId,
    },
  })

  return redirect(AppNav.siswa.account())
}

export default function ActionSiswaAccountUploadProfileImageRoute() {
  return <LoadingFullScreen />
}
