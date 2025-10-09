import { Link, Outlet, useLoaderData, useLocation } from '@remix-run/react'
import classNames from 'classnames'
import { adminNavs } from './navs'
import assets from '~/assets'
import AppNav from '~/navigation'
import useAdminPageStore from '~/store/adminPageStore'
import { IoClose } from 'react-icons/io5'
import { LoaderDataAdmin } from '~/types/loaders-data/admin'
import { useEffect } from 'react'
import useAuthStore from '~/store/authStore'
import DBHelpers from '~/database/helpers'

export default function AdminDashboardLayout() {
  const loader = useLoaderData<LoaderDataAdmin>()
  const location = useLocation()
  const user = useAuthStore(state => state.user)
  const openSidebar = useAdminPageStore(state => state.openSidebar)

  const closeSidebar = () => useAdminPageStore.setState({ openSidebar: false })

  useEffect(() => {
    if (loader.user) useAuthStore.setState({ user: loader.user })
  }, [loader])

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
            {adminNavs.map((item, index) => (
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
            <div className='p-8 md:p-4 flex flex-row items-center gap-2 cursor-pointer hover:bg-primary/10 duration-300'>
              <div className='rounded-full w-10 h-10 bg-primary'></div>
              <div className='flex flex-col justify-center grow'>
                <p className='line-clamp-1 font-semibold text-xl md:text-lg'>{DBHelpers.akun.getDisplayName(user)}</p>
                <p className='line-clamp-1 text-gray-500 md:text-sm'>{user.username}</p>
              </div>
            </div>
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
