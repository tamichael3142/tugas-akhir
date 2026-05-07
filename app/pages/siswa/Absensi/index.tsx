import { useLoaderData, useRevalidator } from '@remix-run/react'
import { Button } from '~/components/forms'
import { LoadingFullScreen } from '~/components/ui'
import TahunDanSemesterAjaranCard from '../_components/TahunDanSemesterAjaranCard'
import { FaPrint } from 'react-icons/fa6'
import AbsensiTable from './_components/AbsensiTable'
import { LoaderDataSiswaAbsensi } from '~/types/loaders-data/siswa'
import SiswaPageContainer from '~/layouts/siswa/SiswaPageContainer'

const sectionPrefix = 'siswa-absensi'

export default function SiswaAbsensiPage() {
  const loader = useLoaderData<LoaderDataSiswaAbsensi>()
  const revalidator = useRevalidator()

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <SiswaPageContainer
      title='Absensi'
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
      </div>

      {loader.kelass && loader.kelass.length > 0 && loader.user ? (
        <AbsensiTable
          siswaId={loader.user.id}
          sectionPrefix={sectionPrefix}
          currentTahunAjaran={loader.currentTahunAjaran}
          currentSemester={loader.currentSemester}
          kelass={loader.kelass}
        />
      ) : null}
    </SiswaPageContainer>
  )
}
