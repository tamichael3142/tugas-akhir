import classNames from 'classnames'
import { Fragment, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { IoMenuSharp } from 'react-icons/io5'
import useAdminPageStore from '~/store/adminPageStore'

interface Props {
  title?: string
  children?: ReactNode
  actions?: ReactNode[]
  className?: string
}

export default function AdminPageContainer(props: Props) {
  const title = useAdminPageStore(state => state.title)

  return (
    <Fragment>
      <div className={classNames(props.className)}>
        <div className='p-4 md:px-8 sticky top-0 bg-grey-light'>
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

      <Toaster
        position='top-right'
        reverseOrder={false}
        gutter={8}
        containerStyle={{ marginTop: 70, marginRight: 16 }}
        toastOptions={
          {
            // Define default options
            // className: '',
            // duration: 5000,
            // removeDelay: 1000,
            // style: {
            //   background: '#363636',
            //   color: '#fff',
            // },
            // Default options for specific types
            // success: {
            //   duration: 3000,
            //   iconTheme: {
            //     primary: 'green',
            //     secondary: 'black',
            //   },
            // },
          }
        }
      />
    </Fragment>
  )
}
