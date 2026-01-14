import { Link, Outlet, useLoaderData, useLocation, useNavigate } from '@remix-run/react'
import classNames from 'classnames'
import { guruNavs } from './navs'
import assets from '~/assets'
import AppNav from '~/navigation'
import { IoClose } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import useAuthStore from '~/store/authStore'
import DBHelpers from '~/database/helpers'
import { LoaderDataGuru } from '~/types/loaders-data/guru'
import useGuruPageStore from '~/store/guruPageStore'
import { usePopup } from '~/hooks/usePopup'

export default function GuruDashboardLayout() {
  const loader = useLoaderData<LoaderDataGuru>()
  const location = useLocation()
  const popup = usePopup()
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const openSidebar = useGuruPageStore(state => state.openSidebar)
  const [timeoutId, setTimeoutId] = useState<number | null>(null)

  const closeSidebar = () => useGuruPageStore.setState({ openSidebar: false })

  useEffect(() => {
    if (loader.user) useAuthStore.setState({ user: loader.user })
  }, [loader])

  function closePopup() {
    popup.reset()
  }

  function openPopup() {
    popup.open({
      onClose: closePopup,
      title: user?.displayName ?? user?.username ?? user?.email,
      content: <p>Apakah anda ingin logout?</p>,
      actionButtons: [
        { label: 'Cancel', variant: 'text', color: 'secondary', buttonProps: { onClick: closePopup } },
        {
          label: 'Logout',
          variant: 'contained',
          buttonProps: {
            onClick: () => {
              closePopup()
              navigate(AppNav.auth.logout())
            },
          },
        },
      ],
    })
  }

  function onAccountHover() {
    setTimeoutId(
      window.setTimeout(() => {
        openPopup()
      }, 500),
    )
  }

  function onAccountHoverOut() {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId)
      setTimeoutId(null)
    }
  }

  return (
    <div className='w-screen min-h-screen relative'>
      <div
        className={classNames(
          'fixed bg-white w-[300px] md:translate-x-0 h-screen z-20 rounded-r-2xl md:shadow-2xl duration-300',
          {
            ['translate-x-[-300px]']: !openSidebar,
            ['shadow-2xl']: openSidebar,
          },
        )}
      >
        <div className='flex flex-col gap-4 h-full'>
          <div className='p-8 md:p-4 pb-0'>
            <Link to={AppNav.admin.dashboard()} onClick={closeSidebar}>
              <img src={assets.images.logoSMP()} alt='Logo Admin' className='w-full h-fit' />
            </Link>
          </div>

          <div className='flex flex-col grow overflow-auto p-8 md:p-4 pt-0'>
            {guruNavs.map((item, index) => (
              <Link
                key={`adminDashboard-sidebar-${index}`}
                to={item.href ?? ''}
                className={classNames('rounded-2xl text-left w-full py-2 px-4 cursor-pointer hover:bg-primary/10', {
                  ['bg-primary text-white hover:!bg-primary/100']: item.href === location.pathname,
                })}
                onClick={closeSidebar}
              >
                <div className='flex flex-row items-center gap-2'>
                  <div className='text-xl'>{item.icon}</div>
                  <p>{item.label}</p>
                </div>
              </Link>
            ))}
          </div>

          {user ? (
            <button
              onMouseEnter={onAccountHover}
              onMouseLeave={onAccountHoverOut}
              onClick={openPopup}
              className='p-8 md:p-4 flex flex-row items-center gap-2 cursor-pointer hover:bg-primary/10 duration-300'
            >
              <div className='rounded-full w-10 h-10 bg-primary'></div>
              <div className='flex flex-col justify-center grow'>
                <p className='line-clamp-1 text-start font-semibold text-xl md:text-lg'>
                  {DBHelpers.akun.getDisplayName(user)}
                </p>
                <p className='line-clamp-1 text-start text-gray-500 md:text-sm'>{user.username}</p>
              </div>
            </button>
          ) : null}
        </div>
      </div>
      <button
        className={classNames(
          'z-20 text-2xl text-white font-semibold absolute top-4 left-[320px] p-4 rounded-full bg-primary flex items-center justify-center md:hidden',
          {
            ['hidden -z-20']: !openSidebar,
          },
        )}
        onClick={closeSidebar}
      >
        <IoClose />
      </button>
      <button
        className={classNames('z-10 w-screen h-screen fixed md:hidden translate-x-[-100vw]', {
          ['bg-black/50 !translate-x-0']: openSidebar,
        })}
        onClick={closeSidebar}
      />
      <div className='bg-grey-light min-h-screen md:pl-[300px]'>
        <Outlet />
      </div>
    </div>
  )
}
