import { ReactNode } from 'react'

export type DataGridProps<T> = {
  id?: string
  columns?: DataGridColumnProps<T>[]
  rows?: T[]
  actions?: (row: T) => ReactNode
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  className?: string
  leadingView?: ReactNode
}

export type DataGridColumnProps<T> = {
  field: keyof T | string
  label?: ReactNode
  render?: (row: T, index: number) => ReactNode
}
