import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export default function LoadingFullScreen() {
  return (
    <div className='fixed z-[100] top-0 bottom-0 left-0 right-0 flex flex-row items-center justify-center bg-grey-dark'>
      <AiOutlineLoading3Quarters className='animate-spin w-14 h-14 text-primary' />
    </div>
  )
}
