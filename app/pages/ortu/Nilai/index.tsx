import { Akun, SemesterAjaran, TahunAjaran } from '@prisma/client'
import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { Button, StaticSelect } from '~/components/forms'
import { Card, LoadingFullScreen } from '~/components/ui'
import DBHelpers from '~/database/helpers'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import OrtuPageContainer from '~/layouts/ortu/OrtuPageContainer'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { LoaderDataOrtuNilai } from '~/types/loaders-data/ortu'
import EkstrakulikulerCard from './_components/EkstrakulikulerCard'
import KelasCard from './_components/KelasCard'
import { FaPrint } from 'react-icons/fa6'

const sectionPrefix = 'ortu-nilai'

export default function OrtuNilaiPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const loader = useLoaderData<LoaderDataOrtuNilai>()
  const revalidator = useRevalidator()

  const currentSiswaId = searchParams.get('siswaId') ?? ''
  const currentTahunAjaranId = searchParams.get('tahunAjaranId') || (loader.currentTahunAjaran?.id ?? '')
  const currentSemesterAjaranId = searchParams.get('semesterAjaranId') || (loader.currentSemester?.id ?? '')

  function handlePageChange({
    siswaId,
    tahunAjaranId,
    semesterAjaranId,
  }: {
    siswaId?: Akun['id']
    tahunAjaranId?: TahunAjaran['id']
    semesterAjaranId?: SemesterAjaran['id']
  }) {
    const params = new URLSearchParams(searchParams)
    if (siswaId) params.set('siswaId', siswaId)
    else params.delete('siswaId')
    if (tahunAjaranId) params.set('tahunAjaranId', tahunAjaranId)
    else params.delete('tahunAjaranId')
    if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
    else params.delete('semesterAjaranId')
    navigate(`?${params.toString()}`, { replace: false })
  }

  if (revalidator.state === 'loading' || !loader.user) return <LoadingFullScreen />
  return (
    <OrtuPageContainer
      title='Student Assessment'
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
            { value: '', label: 'Choose a student...' },
            ...(loader.user.children
              ? loader.user.children.map(item => ({
                  value: item.siswaId,
                  label: DBHelpers.akun.getDisplayName(item.siswa),
                }))
              : []),
          ]}
          selectProps={{
            value: currentSiswaId,
            onChange: e =>
              handlePageChange({
                siswaId: e.target.value,
                tahunAjaranId: currentTahunAjaranId,
                semesterAjaranId: currentSemesterAjaranId,
              }),
          }}
        />

        <Card className='mt-6 grid grid-cols-2 gap-4 lg:gap-8 print:shadow-none print:rounded-none'>
          <StaticSelect
            label='Academic Year'
            options={loader.tahunAjarans.map(item => ({ value: item.id, label: item.nama }))}
            selectProps={{
              value: currentTahunAjaranId,
              onChange: e =>
                handlePageChange({
                  siswaId: currentSiswaId,
                  tahunAjaranId: e.target.value,
                  semesterAjaranId: '',
                }),
            }}
          />
          <StaticSelect
            label='Academic Semester'
            options={(loader.currentTahunAjaran?.semesterAjaran ?? []).map(item => ({
              value: item.id,
              label: EnumsTitleUtils.getSemesterAjaranUrutan(item.urutan as SemesterAjaranUrutan),
            }))}
            selectProps={{
              value: currentSemesterAjaranId,
              onChange: e =>
                handlePageChange({
                  siswaId: currentSiswaId,
                  tahunAjaranId: currentTahunAjaranId,
                  semesterAjaranId: e.target.value,
                }),
            }}
          />
        </Card>

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
            <p className='text-sm'>
              {currentSiswaId ? 'No assessment recorded on this semester yet.' : 'Please select a student.'}
            </p>
          </div>
        )}

        {loader.dataSiswa?.siswaPerEkstrakulikuler?.map(item => (
          <EkstrakulikulerCard
            key={`ekstrakulikuler-card-${item.id}`}
            ekstrakulikuler={item.ekstrakulikuler}
            kompetensiEkstrakulikulers={loader.kompetensiEkstrakulikulers}
            penilaianEkstrakulikulers={loader.penilaianEkstrakulikulers}
            className='mt-8'
          />
        ))}
      </div>
    </OrtuPageContainer>
  )
}
