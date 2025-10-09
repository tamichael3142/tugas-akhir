import { prisma } from '~/utils/db.server'
import { DBAuthErrorType } from '../enums/auth-error.enums'
import PasswordUtils from '~/utils/password.utils'
import { Akun } from '@prisma/client'
import { removeAuthCookie } from '~/utils/auth.utils'
import { Role } from '../enums/prisma.enums'
import AppNav from '~/navigation'

type DBAuthUtilsReturnType = {
  success: boolean
  errorType?: DBAuthErrorType
  message?: string
  user?: Akun
}

async function loginWithUsernameNIPAndPassword({
  usernameOrNIP,
  password,
}: {
  usernameOrNIP: string
  password: string
}): Promise<DBAuthUtilsReturnType> {
  const existingAkun = await prisma.akun.findFirst({
    where: {
      OR: [{ username: usernameOrNIP }, { nip: usernameOrNIP }],
    },
  })

  if (!existingAkun)
    return { success: false, errorType: DBAuthErrorType.AKUN_NOT_FOUND, message: 'Akun tidak ditemukan!' }

  const passwordValid = await PasswordUtils.verifyPassword({ password, hashedPassword: existingAkun.password })

  return {
    success: passwordValid,
    errorType: passwordValid ? undefined : DBAuthErrorType.WRONG_PASSWORD,
    message: passwordValid ? undefined : 'Password salah!',
    user: passwordValid ? existingAkun : undefined,
  }
}

async function logout() {
  await removeAuthCookie()
}

function getGuardRedirectUrlBasedByRole(value: Role): string {
  switch (value) {
    case Role.ADMIN:
      return AppNav.admin.dashboard()
    default:
      return AppNav.main.home()
  }
}

const auth = {
  loginWithUsernameNIPAndPassword,
  logout,
  getGuardRedirectUrlBasedByRole,
}

export default auth
