import { LinkProps, useNavigate } from '@remix-run/react'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { IoCaretBackOutline } from 'react-icons/io5'
import { Button } from '~/components/forms'

export type BackButtonProps = {
  id?: string
  label?: ReactNode
  icon?: ReactNode
  to?: LinkProps['to']
  className?: string
}

export default function BackButton(props: BackButtonProps) {
  const navigate = useNavigate()

  return (
    <Button
      color='primary'
      variant='contained'
      startIcon={props.icon ?? <IoCaretBackOutline />}
      label={props.label ?? 'Back'}
      onlyIconOnSmallView
      className={classNames(props.className)}
      buttonProps={{
        onClick: () => {
          if (props.to) navigate(props.to)
          else navigate(-1)
        },
      }}
    />
  )
}
