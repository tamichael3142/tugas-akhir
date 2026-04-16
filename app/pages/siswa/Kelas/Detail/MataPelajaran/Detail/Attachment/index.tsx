import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { TextInput } from '~/components/forms'
import { Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import SiswaKelasDetailMataPelajaranDetailTab, { TabKey } from '../_components/Tab'
import { LoaderDataSiswaKelasDetailMataPelajaranDetailAttachment } from '~/types/loaders-data/siswa'

const sectionPrefix = 'siswa-kelas-detail-mata-pelajaran-detail-attachment'

export default function SiswaKelasDetailMataPelajaranDetailAttachmentPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataSiswaKelasDetailMataPelajaranDetailAttachment>()
  const revalidator = useRevalidator()

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

  function handlePageChange({ newPage, search }: { newPage: number; search?: string }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (search) params.set('search', search)
    else params.delete('search')
    navigate(`?${params.toString()}`, { replace: false })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (searchText) params.set('search', searchText)
      else params.delete('search')
      params.set('page', '1')
      navigate(`?${params.toString()}`, { replace: false })
    }, 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='!p-0 mt-4 lg:mt-8'>
      <SiswaKelasDetailMataPelajaranDetailTab
        kelas={loader.kelas}
        mataPelajaran={loader.mataPelajaran}
        activeTabKey={TabKey.ATTACHMENT}
      />

      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        leadingView={
          <div className='flex flex-col sm:flex-row items-center gap-4 mb-5'>
            <TextInput
              className='max-w-xs'
              inputProps={{
                placeholder: 'Cari tugas...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
            <div className='grow'></div>
          </div>
        }
        columns={[
          { field: 'title', label: 'Judul', render: row => row.title },
          { field: 'description', label: 'Deskripsi', render: row => row.description },
          {
            field: 'downloadUrl',
            label: 'File',
            render: row => (
              <a target='_blank' rel='noreferrer' href={row.downloadUrl}>
                Download
              </a>
            ),
          },
        ]}
        rows={loader.attachments.data}
        pagination={{
          page: loader.attachments.pagination.page,
          pageSize: loader.attachments.pagination.limit,
          total: loader.attachments.pagination.total,
          totalPages: loader.attachments.pagination.totalPages,
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='border-none'
      />
    </Card>
  )
}
