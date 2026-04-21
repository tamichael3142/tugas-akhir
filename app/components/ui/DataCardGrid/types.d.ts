import { ReactNode } from 'react'

export type DataCardGridProps<T> = {
  id?: string
  rows?: T[]
  className?: string
  leadingView?: ReactNode
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  renderCard: (
    row: T,
    index: number,
  ) => {
    header?: ReactNode
    subHeader?: ReactNode
    headerAction?: ReactNode
    content?: ReactNode
  }
}
