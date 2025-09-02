import { Link } from '@remix-run/react'
import AuthMainLayout from '~/layouts/auth/AuthMainLayout'
import AppNav from '~/navigation'

export default function LoginPage() {
  return (
    <AuthMainLayout>
      Login Page
      <Link to={AppNav.main.home()}>Home</Link>
    </AuthMainLayout>
  )
}
