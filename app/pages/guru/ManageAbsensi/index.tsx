import { useLoaderData, useRevalidator } from '@remix-run/react'
import { AbsensiCalendar, Card, LoadingFullScreen } from '~/components/ui'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import AppNav from '~/navigation'
import { LoaderDataGuruManageAbsensi } from '~/types/loaders-data/guru'

export default function GuruManageAbsensiPage() {
  const loader = useLoaderData<LoaderDataGuruManageAbsensi>()
  const revalidator = useRevalidator()

  if (revalidator.state === 'loading') return <LoadingFullScreen />

  return (
    <GuruPageContainer title='Manage Attendance'>
      <Card className='shadow-lg overflow-hidden'>
        <AbsensiCalendar
          absensis={loader.absensis}
          editUrl={id => AppNav.guru.manageAbsensiEdit({ absensiId: id })}
          mutateUrl={id => AppNav.guru.manageAbsensiMutate({ absensiId: id })}
        />
      </Card>
    </GuruPageContainer>
  )
}
