import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export default function LoadingFullScreen() {
  return (
    <div className='w-screen h-screen flex flex-row items-center justify-center bg-grey-dark'>
      <AiOutlineLoading3Quarters className='animate-spin w-14 h-14 text-primary' />
    </div>
  )
}
