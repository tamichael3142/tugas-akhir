import { useLoaderData, useNavigate, useRevalidator } from '@remix-run/react'
import { useCallback } from 'react'
import { Button } from '~/components/forms'
import { AbsensiCalendar, Card, LoadingFullScreen } from '~/components/ui'
import { LoaderDataGuruDaftarKelasDetailAbsensiList } from '~/types/loaders-data/guru'
import GuruDaftarKelasDetailTab, { TabKey } from '../_components/Tab'
import AppNav from '~/navigation'

export default function GuruDaftarKelasDetailAbsensiListPage() {
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailAbsensiList>()
  const revalidator = useRevalidator()

  const handleTodayAttendance = useCallback(() => {
    if (loader.todayAbsensi) navigate(AppNav.guru.manageAbsensiEdit({ absensiId: loader.todayAbsensi.id }))
    else if (loader.currentSemesterAjaran)
      navigate(AppNav.guruAction.daftarKelasDetailAbsensiCreate({ kelasId: loader.kelas?.id ?? '' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader.todayAbsensi, loader.currentSemesterAjaran])

  if (revalidator.state === 'loading') return <LoadingFullScreen />

  return (
    <Card className='p-0! mt-4 lg:mt-8'>
      <GuruDaftarKelasDetailTab kelas={loader.kelas} activeTabKey={TabKey.ABSENSI} />

      <div className='p-4 md:p-8'>
        <div className='flex justify-end mb-6'>
          <Button label='Today Attendance' color='primary' buttonProps={{ onClick: handleTodayAttendance }} />
        </div>

        <AbsensiCalendar
          absensis={loader.absensis}
          editUrl={id => AppNav.guru.manageAbsensiEdit({ absensiId: id })}
          mutateUrl={id => AppNav.guru.manageAbsensiMutate({ absensiId: id })}
        />
      </div>
    </Card>
  )
}
