import classNames from 'classnames'
import { Button } from '~/components/forms'
import { Card } from '~/components/ui'
import usePopupStore, { PopupStore } from '~/store/popupStore'
import { IoMdClose } from 'react-icons/io'

export function usePopup() {
  function open(values: Omit<Partial<PopupStore>, 'open'>) {
    usePopupStore.setState({
      open: true,
      size: values.size ?? 'md',
      title: values.title ?? null,
      content: values.content ?? null,
      closeOnOverlayClick: values.closeOnOverlayClick ?? false,
      onClose: values.onClose ?? null,
      actionButtons: values.actionButtons ?? null,
    })
  }

  function close() {
    usePopupStore.setState({
      open: false,
      size: 'sm',
      content: null,
      title: null,
      closeOnOverlayClick: false,
      onClose: null,
      actionButtons: null,
    })
  }

  return {
    open,
    close,
    reset: close,
  }
}

export default function PopupProvider() {
  const popup = usePopup()
  const open = usePopupStore(state => state.open)
  const size = usePopupStore(state => state.size)
  const title = usePopupStore(state => state.title)
  const content = usePopupStore(state => state.content)
  const closeOnOverlayClick = usePopupStore(state => state.closeOnOverlayClick)
  const onClose = usePopupStore(state => state.onClose)
  const actionButtons = usePopupStore(state => state.actionButtons)

  if (open)
    return (
      <div
        className={classNames(
          'fixed top-0 bottom-0 left-0 right-0 z-50 bg-black/30 flex flex-col items-center justify-center',
          {
            ['px-4']: size !== 'fullScreen',
          },
        )}
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className={classNames('fixed top-0 bottom-0 left-0 right-0 z-50')}
          onClick={() => (closeOnOverlayClick ? popup.close() : undefined)}
        />
        <Card
          className={classNames('mx-auto w-full bg-white z-[60] p-4!', {
            ['max-w-sm']: size === 'sm',
            ['max-w-md']: size === 'md',
            ['max-w-lg']: size === 'lg',
            ['w-screen h-screen rounded-none']: size === 'fullScreen',
          })}
        >
          {title ? (
            <div className='flex flex-row items-center gap-2'>
              <h3 className='grow text-xl font-medium'>{title}</h3>
              {onClose ? (
                <Button
                  startIcon={<IoMdClose className='text-2xl' />}
                  className='p-1!'
                  variant='text'
                  buttonProps={{ onClick: onClose }}
                />
              ) : null}
            </div>
          ) : null}
          <div className='py-4'>{content}</div>
          {actionButtons ? (
            <div className='flex flex-row items-center justify-end gap-2'>
              {actionButtons.map((item, index) => (
                <Button key={`global-popup-actionButtons-${index}`} {...item} />
              ))}
            </div>
          ) : null}
        </Card>
      </div>
    )
  return null
}
