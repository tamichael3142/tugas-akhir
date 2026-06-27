import { Akun } from '@prisma/client'
import { TipeAbsensi } from '~/database/enums/prisma.enums'
import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { StaticSelect } from '~/components/forms'
import { AbsensiCalendar, Card, LoadingFullScreen } from '~/components/ui'
import DBHelpers from '~/database/helpers'
import OrtuPageContainer from '~/layouts/ortu/OrtuPageContainer'
import { LoaderDataOrtuAbsensi } from '~/types/loaders-data/ortu'
import TahunDanSemesterAjaranCard from '../_components/TahunDanSemesterAjaranCard'
import EnumsTitleUtils from '~/utils/enums-title.utils'

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
      key={sectionPrefix}
      title='Student Absence'
      // actions={[
      //   <Button
      //     key={`${sectionPrefix}-print-button`}
      //     label='Print'
      //     color='secondary'
      //     startIcon={<FaPrint />}
      //     onlyIconOnSmallView
      //     buttonProps={{ onClick: () => window.print() }}
      //   />,
      // ]}
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
          <p className='text-sm'>Please select a student.</p>
        </div>
      ) : loader.kelass && loader.kelass.length > 0 ? (
        <Card className='mt-8 shadow-lg overflow-hidden'>
          <AbsensiCalendar
            absensis={loader.kelass.flatMap(kelas =>
              kelas.absensis.map(absensi => ({
                id: absensi.id,
                tanggal: absensi.tanggal,
                kelas: { nama: kelas.nama },
                status: absensi.siswaTerabsen[0]
                  ? EnumsTitleUtils.getTipeAbsensi(absensi.siswaTerabsen[0].tipe as TipeAbsensi)
                  : undefined,
              })),
            )}
          />
        </Card>
      ) : (
        <div className='bg-neutral-100 rounded-xl p-4 mt-8 shadow'>
          <p className='font-semibold mb-2'>No attendance data found.</p>
          <p className='text-sm'>This student has no recorded attendance for the current semester.</p>
        </div>
      )}
    </OrtuPageContainer>
  )
}
