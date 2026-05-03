import { Akun } from '@prisma/client'
import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { Button, StaticSelect } from '~/components/forms'
import { LoadingFullScreen } from '~/components/ui'
import DBHelpers from '~/database/helpers'
import OrtuPageContainer from '~/layouts/ortu/OrtuPageContainer'
import { LoaderDataOrtuAbsensi } from '~/types/loaders-data/ortu'
import TahunDanSemesterAjaranCard from '../_components/TahunDanSemesterAjaranCard'
import { FaPrint } from 'react-icons/fa6'
import AbsensiTable from './_components/AbsensiTable'

const sectionPrefix = 'ortu-absensi'

export default function OrtuAbsensiPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const loader = useLoaderData<LoaderDataOrtuAbsensi>()
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
    <OrtuPageContainer
      title='Absensi Siswa'
      actions={[
        <Button
          key={`${sectionPrefix}-print-button`}
          label='Print'
          color='secondary'
          startIcon={<FaPrint />}
          onlyIconOnSmallView
          buttonProps={{ onClick: () => window.print() }}
        />,
      ]}
    >
      <div id='print-area'>
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
      </div>

      {!currentSiswaId ? (
        <div className='bg-neutral-100 rounded-xl p-4 mt-8 shadow'>
          <p className='font-semibold mb-2'>Oops!</p>
          <p className='text-sm'>Mohon memilih siswa yang akan diakses.</p>
        </div>
      ) : loader.kelass && loader.kelass.length > 0 ? (
        <AbsensiTable
          siswaId={currentSiswaId}
          sectionPrefix={sectionPrefix}
          currentTahunAjaran={loader.currentTahunAjaran}
          currentSemester={loader.currentSemester}
          kelass={loader.kelass}
        />
      ) : null}
    </OrtuPageContainer>
  )
}
