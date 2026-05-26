import { useLoaderData, useRevalidator } from '@remix-run/react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraDetail } from '~/types/loaders-data/guru'
import GuruManageMataPelajaranDetailTab, { TabKey } from '../../_components/Tab'
import GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraDetailDetailComponent from './detail-component'

const sectionPrefix = 'guru-daftar-kelas-detail-mata-pelajaran-detail-berita-acara-detail'

export default function GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraDetailPage() {
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraDetail>()
  const revalidator = useRevalidator()

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card key={sectionPrefix} className='p-0! mt-4 lg:mt-8'>
      <GuruManageMataPelajaranDetailTab
        kelas={loader.kelas}
        mataPelajaran={loader.mataPelajaran}
        activeTabKey={TabKey.BERITA_ACARA}
      />

      <div className='p-4 lg:px-8'>
        <div className='flex flex-row items-center gap-4'>
          <h2 className='font-semibold text-xl'>Daily Report Detail</h2>
          <div className='grow' />
          <BackButton buttonProps={{ size: 'sm', variant: 'outlined', color: 'secondary' }} />
        </div>
        <hr className='my-4' />

        <GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraDetailDetailComponent beritaAcara={loader.beritaAcara} />
      </div>
    </Card>
  )
}
