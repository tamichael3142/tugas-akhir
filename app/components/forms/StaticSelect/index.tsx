import classNames from 'classnames'
import { ComponentProps, ReactNode, useState } from 'react'

export type StaticSelectProps = {
  label?: ReactNode
  className?: string
  options?: { value: string; label: string }[]
  selectProps?: ComponentProps<'select'>
}

export default function StaticSelect(props: StaticSelectProps) {
  const { selectProps = {}, options = [] } = props
  const { className, onFocus, onBlur, ...restSelectProps } = selectProps

  const [isFocused, setIsFocused] = useState<boolean>(false)

  return (
    <div className={classNames('', props.className)}>
      {props.label ? (
        typeof props.label === 'string' ? (
          <label htmlFor={props.selectProps?.id} className='text-sm'>
            {props.label}
          </label>
        ) : (
          props.label
        )
      ) : null}
      <div
        className={classNames('border-2 border-gray-300 rounded-lg px-3 py-2 flex flex-row items-center', {
          ['mt-1']: typeof props.label === 'string',
          ['border-primary']: isFocused,
        })}
      >
        <select
          className={classNames('outline-0 grow', className)}
          onFocus={e => {
            setIsFocused(true)
            if (onFocus) onFocus(e)
          }}
          onBlur={e => {
            setIsFocused(false)
            if (onBlur) onBlur(e)
          }}
          {...restSelectProps}
        >
          {options.map((opt, index) => (
            <option key={`${props.selectProps?.id}-static-select-option-${index}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
