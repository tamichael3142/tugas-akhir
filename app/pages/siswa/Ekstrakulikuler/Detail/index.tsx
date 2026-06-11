import { useLoaderData, useRevalidator } from '@remix-run/react'
import { ReactNode } from 'react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import DBHelpers from '~/database/helpers'
import SiswaPageContainer from '~/layouts/siswa/SiswaPageContainer'
import { LoaderDataSiswaEkstrakulikulerDetail } from '~/types/loaders-data/siswa'
import SiswaEkstrakulikulerDetailTab, { TabKey } from './_components/Tab'

const sectionPrefix = 'siswa-ekstrakulikuler-detail'

export default function SiswaEkstrakulikulerDetailPage() {
  const loader = useLoaderData<LoaderDataSiswaEkstrakulikulerDetail>()
  const revalidator = useRevalidator()

  function DetailItem({ label, children }: { label?: ReactNode; children?: ReactNode }) {
    return (
      <div className='col-span-3 lg:col-span-1 h-full'>
        <div className='text-sm font-semibold'>{label}</div>
        <div className='border-b py-2 px-1'>{children}</div>
      </div>
    )
  }

  function getPenilaian({
    kompetensiEkstrakulikulerId,
  }: {
    kompetensiEkstrakulikulerId: string
  }): LoaderDataSiswaEkstrakulikulerDetail['penilaianEkstrakulikulers'][0] | undefined {
    return loader.penilaianEkstrakulikulers.find(
      item => item.kompetensiEkstrakulikulerId === kompetensiEkstrakulikulerId,
    )
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <SiswaPageContainer
      title={`Extracurricular: ${loader.ekstrakulikuler?.nama}`}
      actions={[<BackButton key={`${sectionPrefix}-back-button`} buttonProps={{ color: 'secondary' }} />]}
    >
      <Card className='p-0!'>
        <div className='grid grid-cols-3 gap-4 lg:gap-8 p-4 lg:p-8'>
          <DetailItem label={'Room'}>{loader.ekstrakulikuler?.ruangan ?? '-'}</DetailItem>
          <DetailItem label={'Academic Year'}>{loader.ekstrakulikuler?.tahunAjaran.nama}</DetailItem>
          {loader.ekstrakulikuler?.pengajar ? (
            <DetailItem label={'Teacher'}>{DBHelpers.akun.getDisplayName(loader.ekstrakulikuler.pengajar)}</DetailItem>
          ) : null}
        </div>
      </Card>

      <Card className='!p-0 mt-4 lg:mt-8'>
        <SiswaEkstrakulikulerDetailTab ekstrakulikuler={loader.ekstrakulikuler} activeTabKey={TabKey.ASSESSMENT} />

        <div className='w-full max-w-full overflow-x-auto pb-4 max-h-[400px]'>
          <table className='border-collapse border'>
            <thead className='bg-white'>
              <tr>
                {loader.kompetensiEkstrakulikulers.map(kompetensi => (
                  <th key={kompetensi.id} className='sticky top-0 z-20 bg-white border p-2'>
                    {kompetensi.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {loader.kompetensiEkstrakulikulers.map(kompetensi => {
                  const containerKey = `${sectionPrefix}-${kompetensi.id}`
                  const currPenilaian = getPenilaian({ kompetensiEkstrakulikulerId: kompetensi.id })

                  return (
                    <td key={containerKey} className='border'>
                      <div className='w-32 p-2 text-center'>
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
    </SiswaPageContainer>
  )
}
