import { useLoaderData, useParams, useRevalidator } from '@remix-run/react'
import { Card, LoadingFullScreen } from '~/components/ui'
import { LoaderDataSiswaKelasDetailMataPelajaranDetailPenilaian } from '~/types/loaders-data/siswa'
import SiswaKelasDetailMataPelajaranDetailTab, { TabKey } from '../_components/Tab'

const sectionPrefix = 'siswa-kelas-detail-mata-pelajaran-detail-penilaian'

export default function SiswaKelasDetailMataPelajaranDetailPenilaianPage() {
  const params = useParams()
  const loader = useLoaderData<LoaderDataSiswaKelasDetailMataPelajaranDetailPenilaian>()
  const revalidator = useRevalidator()

  function getPenilaian({
    kelasId,
    mataPelajaranId,
    kompetensiId,
    siswaId,
  }: {
    kelasId: string
    mataPelajaranId: string
    kompetensiId: string
    siswaId: string
  }): LoaderDataSiswaKelasDetailMataPelajaranDetailPenilaian['penilaians'][0] | undefined {
    const penilaians = [...loader.penilaians]
    const existing = penilaians.find(
      item =>
        item.kelasId === kelasId &&
        item.mataPelajaranId === mataPelajaranId &&
        item.kompetensiId === kompetensiId &&
        item.siswaId === siswaId,
    )
    return existing
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='!p-0 mt-4 lg:mt-8'>
      <SiswaKelasDetailMataPelajaranDetailTab
        kelas={loader.kelas}
        mataPelajaran={loader.mataPelajaran}
        activeTabKey={TabKey.PENILAIAN}
      />
      <div className='w-full max-w-full overflow-x-auto pb-4 max-h-[400px]'>
        <table className='border-collapse border'>
          <thead className='bg-white'>
            <tr>
              {loader.kompetensis.map(kompetensi => (
                <th key={kompetensi.id} className='sticky top-0 z-20 bg-white border p-2'>
                  {kompetensi.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {loader.kompetensis.map(kompetensi => {
                const containerKey = `${sectionPrefix}-${kompetensi.id}`
                const currPenilaian = getPenilaian({
                  kelasId: params.kelasId ?? '',
                  mataPelajaranId: params.mataPelajaranId ?? '',
                  kompetensiId: kompetensi.id,
                  siswaId: loader.siswa.id,
                })

                return (
                  <td key={containerKey} className='border'>
                    <div className='w-28 p-2 text-center'>
                      {currPenilaian ? String(Number(currPenilaian.nilai)) : ''}
                    </div>
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
}
