import { ReactNode } from 'react'
import { create } from 'zustand'
import { ButtonProps } from '~/components/forms'

export type PopupStore = {
  open: boolean
  size: 'sm' | 'md' | 'lg' | 'fullScreen'
  title: ReactNode | null
  content: ReactNode | null
  closeOnOverlayClick: boolean
  onClose: (() => void) | null
  actionButtons: ButtonProps[] | null
}

const usePopupStore = create<PopupStore>(() => ({
  open: false,
  size: 'sm',
  title: null,
  content: null,
  closeOnOverlayClick: false,
  onClose: null,
  actionButtons: null,
}))

export default usePopupStore
