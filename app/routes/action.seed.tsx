import { redirect } from '@remix-run/react'
import { seed } from 'prisma/seed'
import { LoadingFullScreen } from '~/components/ui'
import AppNav from '~/navigation'

export async function loader(): Promise<object> {
  await seed()
  return redirect(AppNav.main.home())
}

export default function SeedRoute() {
  return <LoadingFullScreen />
}
