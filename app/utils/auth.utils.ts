import { Akun } from '@prisma/client'
import { createCookie, redirect } from '@remix-run/node'
import AppNav from '~/navigation'

const secret = process.env.COOKIE_SECRET ?? `default-cookie-secret-102405102025`

export const authCookie = createCookie('auth', {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secrets: [secret],
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 30, // 30 days
})

export async function getAuthCookie(request: Request): Promise<Akun['id'] | null | undefined> {
  const userId = (await authCookie.parse(request.headers.get('Cookie'))) as Akun['id'] | null | undefined
  return userId
}

export async function requireAuthCookie(request: Request): Promise<Akun['id']> {
  const userId = await authCookie.parse(request.headers.get('Cookie'))
  if (!userId)
    throw redirect(AppNav.auth.login(), {
      headers: {
        'Set-Cookie': await authCookie.serialize('', {
          maxAge: 0,
        }),
      },
    })

  return userId
}

export async function setAuthCookie(userId: string, nextUrl: string) {
  return redirect(nextUrl, {
    headers: {
      'Set-Cookie': await authCookie.serialize(userId),
    },
  })
}

export async function removeAuthCookie() {
  return redirect(AppNav.auth.login(), {
    headers: {
      'Set-Cookie': await authCookie.serialize('', {
        maxAge: 0,
      }),
    },
  })
}
