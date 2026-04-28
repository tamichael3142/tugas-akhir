import { Akun } from '@prisma/client'
import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { StaticSelect } from '~/components/forms'
import { LoadingFullScreen } from '~/components/ui'
import DBHelpers from '~/database/helpers'
import OrtuPageContainer from '~/layouts/ortu/OrtuPageContainer'
import { LoaderDataOrtuNilai } from '~/types/loaders-data/ortu'
import TahunDanSemesterAjaranCard from '../_components/TahunDanSemesterAjaranCard'
import KelasCard from './_components/KelasCard'

export default function OrtuNilaiPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const loader = useLoaderData<LoaderDataOrtuNilai>()
  const revalidator = useRevalidator()

  const currentSiswaId = searchParams.get('siswaId') ?? ''

  function handlePageChange({ siswaId }: { siswaId: Akun['id'] }) {
    const params = new URLSearchParams(searchParams)
    if (siswaId) params.set('siswaId', siswaId)
    else params.delete('siswaId')
    navigate(`?${params.toString()}`, { replace: false })
  }

  if (revalidator.state === 'loading' || !loader.user) return <LoadingFullScreen />
  return (
    <OrtuPageContainer title='Nilai Siswa'>
      <StaticSelect
        className='max-w-md'
        options={[
          { value: '', label: 'Pilih siswa...' },
          ...(loader.user.children
            ? loader.user.children.map(item => ({
                value: item.siswaId,
                label: DBHelpers.akun.getDisplayName(item.siswa),
              }))
            : []),
        ]}
        selectProps={{
          value: currentSiswaId,
          onChange: e => handlePageChange({ siswaId: e.target.value }),
        }}
      />

      <TahunDanSemesterAjaranCard
        className='mt-6'
        currentTahunAjaran={loader.currentTahunAjaran}
        currentSemester={loader.currentSemester}
      />

      {loader.dataSiswa?.siswaPerKelasDanSemester.map(item => (
        <KelasCard key={`kelas-card-${item.id}`} kelas={item.kelas} kompetensis={loader.kompetensis} className='mt-8' />
      ))}
    </OrtuPageContainer>
  )
}
