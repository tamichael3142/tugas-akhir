import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { LoadingFullScreen } from '~/components/ui'
import { LoaderDataSiswaPengumuman } from '~/types/loaders-data/siswa'
import SiswaPageContainer from '~/layouts/siswa/SiswaPageContainer'
import DataCardGrid from '~/components/ui/DataCardGrid'
import HtmlUtils from '~/utils/html.utils'
import { format } from 'date-fns'
import constants from '~/constants'
import { Button } from '~/components/forms'
import { FaInfo } from 'react-icons/fa'
import AppNav from '~/navigation'

const sectionPrefix = 'siswa-pengumuman'

export default function SiswaPengumumanPage() {
  const loader = useLoaderData<LoaderDataSiswaPengumuman>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const revalidator = useRevalidator()

  function handlePageChange({ newPage }: { newPage: number }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    navigate(`?${params.toString()}`, { replace: false })
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <SiswaPageContainer title='Kelas'>
      {loader.pengumumans && Array.isArray(loader.pengumumans.data) ? (
        <DataCardGrid
          id={`${sectionPrefix}-data-grid`}
          renderCard={row => ({
            header: row.nama,
            subHeader: format(row.updatedAt, constants.dateFormats.dateColumn),
            content: (
              <div
                className='line-clamp-3'
                dangerouslySetInnerHTML={{ __html: HtmlUtils.sanitizeHtml(row.content) }}
              ></div>
            ),
            headerAction: (
              <Button
                label={<FaInfo />}
                size='sm'
                color='secondary'
                buttonProps={{
                  disabled: !!row.deletedAt,
                  onClick: () => navigate(AppNav.siswa.pengumumanDetail({ pengumumanId: row.id })),
                }}
              />
            ),
          })}
          rows={loader.pengumumans.data}
          pagination={{
            page: loader.pengumumans.pagination.page,
            pageSize: loader.pengumumans.pagination.limit,
            total: loader.pengumumans.pagination.total,
            totalPages: loader.pengumumans.pagination.totalPages,
            onPageChange: newPage =>
              handlePageChange({
                newPage,
              }),
          }}
          className='shadow-secondary'
        />
      ) : null}
    </SiswaPageContainer>
  )
}
