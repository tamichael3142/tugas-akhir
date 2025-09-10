import { ReactNode } from 'react'
import { IoMenuSharp } from 'react-icons/io5'
import useAdminPageStore from '~/store/adminPageStore'

interface Props {
  title?: string
  children?: ReactNode
  actions?: ReactNode[]
}

export default function AdminPageContainer(props: Props) {
  const title = useAdminPageStore(state => state.title)

  return (
    <div>
      <div className='p-4 md:px-8'>
        <div className='pb-2 md:pb-4 border-b-2 border-neutral-200 flex flex-row items-center gap-2 md:gap-4'>
          <button className='md:hidden' onClick={() => useAdminPageStore.setState({ openSidebar: true })}>
            <IoMenuSharp className='text-2xl text-primary' />
          </button>
          <h1 className='text-2xl font-semibold grow line-clamp-1' title={title ?? props.title}>
            {title ?? props.title}
          </h1>
          <div className='flex flex-row items-center gap-4'>{props.actions?.map(item => item)}</div>
        </div>
      </div>
      <div className='p-4 md:px-8 pt-2'>{props.children}</div>
    </div>
  )
}
