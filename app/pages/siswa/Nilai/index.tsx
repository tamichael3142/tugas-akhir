import { useLoaderData, useRevalidator } from '@remix-run/react'
import { Button } from '~/components/forms'
import { LoadingFullScreen } from '~/components/ui'
import TahunDanSemesterAjaranCard from '../_components/TahunDanSemesterAjaranCard'
import KelasCard from './_components/KelasCard'
import { FaPrint } from 'react-icons/fa6'
import { LoaderDataSiswaNilai } from '~/types/loaders-data/siswa'
import SiswaPageContainer from '~/layouts/siswa/SiswaPageContainer'

const sectionPrefix = 'siswa-nilai'

export default function SiswaNilaiPage() {
  const loader = useLoaderData<LoaderDataSiswaNilai>()
  const revalidator = useRevalidator()

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <SiswaPageContainer
      title='Score'
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
        <TahunDanSemesterAjaranCard
          className='mt-6'
          currentTahunAjaran={loader.currentTahunAjaran}
          currentSemester={loader.currentSemester}
        />

        {loader.dataSiswa &&
        loader.dataSiswa.siswaPerKelasDanSemester &&
        loader.dataSiswa.siswaPerKelasDanSemester.length > 0 ? (
          loader.dataSiswa?.siswaPerKelasDanSemester.map(item => (
            <KelasCard
              key={`kelas-card-${item.id}`}
              kelas={item.kelas}
              kompetensis={loader.kompetensis}
              className='mt-8'
            />
          ))
        ) : (
          <div className='bg-neutral-100 rounded-xl p-4 mt-8 shadow'>
            <p className='font-semibold mb-2'>Oops!</p>
            <p className='text-sm'>{'Belum ada nilai tercatat pada semester ini.'}</p>
          </div>
        )}
      </div>
    </SiswaPageContainer>
  )
}
