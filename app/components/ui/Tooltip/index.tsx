import classNames from 'classnames'
import { CSSProperties, ReactElement, ReactNode } from 'react'

type Placement = 'top' | 'right' | 'bottom' | 'left'

interface TooltipProps {
  label?: string | ReactNode
  children: ReactElement
  placement?: Placement
  offset?: number
  className?: string
}

export function Tooltip({ label, children, placement = 'top', offset = 12, className }: TooltipProps) {
  if (!label) return children

  const bubblePosClass = {
    top: 'absolute left-1/2 -translate-x-1/2',
    bottom: 'absolute left-1/2 -translate-x-1/2',
    left: 'absolute top-1/2 -translate-y-1/2',
    right: 'absolute top-1/2 -translate-y-1/2',
  }[placement]

  const bubbleOffsetStyle: CSSProperties =
    placement === 'top'
      ? { bottom: `calc(100% + ${offset}px)` }
      : placement === 'bottom'
        ? { top: `calc(100% + ${offset}px)` }
        : placement === 'left'
          ? { right: `calc(100% + ${offset}px)` }
          : { left: `calc(100% + ${offset}px)` }

  let arrowStyle: CSSProperties = {}
  let arrowPosClass = ''

  switch (placement) {
    case 'top':
      // tooltip di atas trigger, arrow ada di bawah bubble -> panah menghadap ke bawah
      arrowPosClass = 'absolute left-1/2 -translate-x-1/2'
      arrowStyle = {
        bottom: '-6px',
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '6px solid rgba(0,0,0,0.85)', // panah menghadap ke BAWAH
        width: 0,
        height: 0,
      }
      break

    case 'bottom':
      // tooltip di bawah trigger, arrow ada di atas bubble -> panah menghadap ke atas
      arrowPosClass = 'absolute left-1/2 -translate-x-1/2'
      arrowStyle = {
        top: '-6px',
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderBottom: '6px solid rgba(0,0,0,0.85)', // panah menghadap ke ATAS
        width: 0,
        height: 0,
      }
      break

    case 'left':
      // tooltip di kiri trigger, arrow ada di kanan bubble -> panah menghadap ke kanan
      arrowPosClass = 'absolute top-1/2 -translate-y-1/2'
      arrowStyle = {
        right: '-6px',
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
        borderLeft: '6px solid rgba(0,0,0,0.85)', // panah menghadap ke KANAN
        width: 0,
        height: 0,
      }
      break

    case 'right':
      // tooltip di kanan trigger, arrow ada di kiri bubble -> panah menghadap ke kiri
      arrowPosClass = 'absolute top-1/2 -translate-y-1/2'
      arrowStyle = {
        left: '-6px',
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
        borderRight: '6px solid rgba(0,0,0,0.85)', // panah menghadap ke KIRI
        width: 0,
        height: 0,
      }
      break
  }

  return (
    <div className='relative inline-block group'>
      {children}

      <div
        role='tooltip'
        aria-hidden='true'
        className={classNames(
          'pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150',
          bubblePosClass,
          'whitespace-nowrap px-2 py-1 rounded-md bg-black text-white text-xs',
          className,
        )}
        style={{
          ...bubbleOffsetStyle,
        }}
      >
        <div className='relative'>
          <div>{label}</div>

          <div aria-hidden='true' className={classNames(arrowPosClass)} style={arrowStyle} />
        </div>
      </div>
    </div>
  )
}
