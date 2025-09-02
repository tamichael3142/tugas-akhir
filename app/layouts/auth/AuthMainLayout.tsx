import { ReactNode } from 'react'
import assets from '~/assets'
import MainFooter from '~/components/Footers/MainFooter'

type Props = {
  children?: ReactNode
}

export default function AuthMainLayout(props: Props) {
  return (
    <div className='w-full min-h-screen'>
      <div className='w-full min-h-screen flex flex-col md:flex-row'>
        <div className='md:w-full md:min-h-screen bg-grey-dark md:flex-3 flex flex-row items-center justify-center'>
          <img src={assets.images.posterMuridBaru()} alt={assets.images.posterMuridBaru()} className='w-full h-auto' />
        </div>
        <div className='md:min-h-screen bg-grey-light md:flex-5 grow'>{props.children}</div>
      </div>
      <MainFooter />
    </div>
  )
}
