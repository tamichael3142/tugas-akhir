import { Button } from '~/components/forms'
import Card from '../Card'
import classNames from 'classnames'
import { GrNext, GrPrevious } from 'react-icons/gr'
import { DataCardGridProps } from './types'

export default function DataCardGrid<T>(props: DataCardGridProps<T>) {
  const { id, rows = [], pagination, renderCard } = props

  return (
    <Card className={classNames('w-full', props.className)}>
      {props.leadingView}

      <div id={id} className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {rows.length === 0 ? (
          <div className='col-span-full text-center text-gray-500 p-6'>No data available</div>
        ) : (
          rows.map((row, idx) => {
            const card = renderCard(row, idx)

            return (
              <div
                key={idx}
                className='border rounded-xl p-4 bg-white shadow-sm hover:shadow-lg duration-150 flex flex-col gap-3  '
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='flex-1 min-w-0'>
                    {card.header && <div className='font-semibold text-base truncate'>{card.header}</div>}

                    {card.subHeader && <div className='text-sm text-gray-500 mt-1'>{card.subHeader}</div>}
                  </div>

                  {card.headerAction && <div className='shrink-0'>{card.headerAction}</div>}
                </div>

                {card.content && <div>{card.content}</div>}
              </div>
            )
          })
        )}
      </div>

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
    </Card>
  )
}
