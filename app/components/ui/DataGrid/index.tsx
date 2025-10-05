import { Button } from '~/components/forms'
import Card from '../Card'
import { DataGridProps } from './types'
import classNames from 'classnames'
import { GrNext, GrPrevious } from 'react-icons/gr'

export default function DataGrid<T>(props: DataGridProps<T>) {
  const { id, columns = [], rows = [], pagination, actions } = props

  return (
    <Card className={classNames('w-full', props.className)}>
      <div className='overflow-x-auto'>
        <table id={id} className='w-full border-collapse text-left'>
          <thead>
            <tr className='border-b'>
              {columns.map(col => (
                <th key={col.field.toString()} className='p-2 font-semibold'>
                  {col.label}
                </th>
              ))}
              {actions && <th className='p-2 text-right'>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className='text-center p-4 text-gray-500'>
                  No data available
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx} className='border-b hover:bg-gray-50'>
                  {columns.map(col => (
                    <td key={col.field.toString()} className='p-2'>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {col.render ? col.render(row) : (row as any)[col.field]}
                    </td>
                  ))}
                  {actions && <td className='p-2 text-right'>{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {pagination ? (
          <div className='flex items-center justify-between mt-4'>
            <span className='text-sm text-gray-600'>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className='flex flex-row space-x-2'>
              <Button
                variant='contained'
                color='secondary'
                label={<GrPrevious />}
                buttonProps={{
                  disabled: pagination.page <= 1,
                  onClick: () => pagination.onPageChange(pagination.page - 1),
                }}
              />
              <Button
                variant='contained'
                color='secondary'
                label={<GrNext />}
                buttonProps={{
                  disabled: pagination.page >= pagination.totalPages,
                  onClick: () => pagination.onPageChange(pagination.page + 1),
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  )
}
