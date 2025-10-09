import { Outlet } from '@remix-run/react'
import { Toaster } from 'react-hot-toast'
import assets from '~/assets'
import MainFooter from '~/components/Footers/MainFooter'

export default function AuthMainLayout() {
  return (
    <div className='w-full min-h-screen'>
      <div className='w-full min-h-screen flex flex-col md:flex-row'>
        <div className='md:w-full md:min-h-screen bg-grey-dark md:flex-3 flex flex-row items-center justify-center'>
          <img src={assets.images.posterMuridBaru()} alt={assets.images.posterMuridBaru()} className='w-full h-auto' />
        </div>
        <div className='md:min-h-screen bg-grey-light md:flex-5 grow'>
          <Outlet />
        </div>
      </div>
      <MainFooter />
      <Toaster
        position='bottom-center'
        reverseOrder={false}
        gutter={8}
        // containerStyle={{ marginTop: 70, marginRight: 16 }}
      />
    </div>
  )
}
