import { Link } from '@remix-run/react'
import AppNav from '~/navigation'

export default function LoginPage() {
  return (
    <div>
      Login Page
      <Link to={AppNav.main.home()}>Home</Link>
    </div>
  )
}
