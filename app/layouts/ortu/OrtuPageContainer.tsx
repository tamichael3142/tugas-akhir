import classNames from 'classnames'
import { Fragment, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { IoMenuSharp } from 'react-icons/io5'
import useOrtuPageStore from '~/store/ortuPageStore'

interface Props {
  title?: string
  children?: ReactNode
  actions?: ReactNode[]
  className?: string
}

export default function OrtuPageContainer(props: Props) {
  const title = useOrtuPageStore(state => state.title)

  return (
    <Fragment>
      <div className={classNames(props.className)}>
        <div className='p-4 md:px-8 sticky top-0 bg-grey-light z-50 no-print print:p-0'>
          <div className='pb-2 md:pb-4 border-b-2 border-neutral-200 flex flex-row items-center gap-2 md:gap-4'>
            <button className='md:hidden' onClick={() => useOrtuPageStore.setState({ openSidebar: true })}>
              <IoMenuSharp className='text-2xl text-secondary' />
            </button>
            <h1 className='text-2xl font-semibold grow line-clamp-1' title={title ?? props.title}>
              {title ?? props.title}
            </h1>
            <div className='flex flex-row items-center gap-4'>{props.actions?.map(item => item)}</div>
          </div>
        </div>
        <div className='p-4 md:px-8 pt-2'>{props.children}</div>
      </div>

      <Toaster
        position='top-right'
        reverseOrder={false}
        gutter={8}
        containerStyle={{ marginTop: 70, marginRight: 16 }}
      />
    </Fragment>
  )
}
