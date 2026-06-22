import { useLoaderData, useRevalidator } from '@remix-run/react'
import { Card, LoadingFullScreen } from '~/components/ui'
import { LoaderDataGuruDaftarKelasDetailDetailSiswa } from '~/types/loaders-data/guru'
import GuruDaftarKelasDetailTab, { TabKey } from '../../_components/Tab'
import GuruDaftarKelasDetailDetailSiswaPageDataDetailComponent from './detail-component'
import { format } from 'date-fns'
import constants from '~/constants'

const sectionPrefix = 'guru-daftar-kelas-detail-detail-siswa'

export default function GuruDaftarKelasDetailDetailSiswaPage() {
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailDetailSiswa>()
  const revalidator = useRevalidator()

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card key={sectionPrefix} className='p-0! mt-4 lg:mt-8'>
      <GuruDaftarKelasDetailTab kelas={loader.kelas} activeTabKey={TabKey.DAFTAR_SISWA} />

      <div className='p-4 md:p-8'>
        <p className='font-semibold text-lg'>Biodata</p>
        <hr className='my-4' />
        <GuruDaftarKelasDetailDetailSiswaPageDataDetailComponent
          account={loader.siswa}
          totalPoint={loader.totalPoint}
        />

        <p className='font-semibold text-lg'>{"This Academic Year's Violations"}</p>

        <div className='max-w-full overflow-auto mt-4'>
          <table className='box-border min-w-full'>
            <thead>
              <tr>
                <th className='border p-2'>Violation Date</th>
                <th className='border p-2'>Minus Point</th>
                <th className='border p-2'>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {loader.siswa.pelanggaransPerKelas.map(pelanggaran => (
                <tr key={`${sectionPrefix}-violations-table-row-${pelanggaran.id}`}>
                  <td className='border p-2 text-center'>
                    {format(pelanggaran.createdAt, constants.dateFormats.dateColumn)}
                  </td>
                  <td className='border p-2 text-center'>{pelanggaran.poin}</td>
                  <td className='border p-2 text-center'>{pelanggaran.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}
