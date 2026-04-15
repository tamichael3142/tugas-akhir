import { useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { Fragment, useEffect } from 'react'
import toast from 'react-hot-toast'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import useAuthStore from '~/store/authStore'
import { ActionDataSiswaKelasDetailMataPelajaranDetailAssignmentSubmission } from '~/types/actions-data/siswa'
import { LoaderDataSiswaKelasDetailMataPelajaranDetailAssignmentDetail } from '~/types/loaders-data/siswa'
import SiswaKelasDetailMataPelajaranDetailTab, { TabKey } from '../../_components/Tab'
import { Button } from '~/components/forms'
import { FaSave } from 'react-icons/fa'
import SiswaKelasDetailMataPelajaranDetailAssignmentDetailFormComponent from './form-component'
import SiswaKelasDetailMataPelajaranDetailAssignmentDetailDetailComponent from './detail-component'
import DBHelpers from '~/database/helpers'

const sectionPrefix = 'siswa-kelas-detail-mata-pelajaran-detail-assignment-detail'

export default function SiswaKelasDetailMataPelajaranDetailAssignmentDetailPage() {
  const loader = useLoaderData<LoaderDataSiswaKelasDetailMataPelajaranDetailAssignmentDetail>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher<ActionDataSiswaKelasDetailMataPelajaranDetailAssignmentSubmission>({
    key: `${sectionPrefix}-form`,
  })
  const user = useAuthStore(state => state.user)

  const userIsOwner = loader.assignmentSubmission ? loader.assignmentSubmission.siswaId === user?.id : true
  const isSubmitable = DBHelpers.mapelAssignment.getIsSubmittable(loader.assignment) && userIsOwner

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) {
      toast.success(fetcher.data.message ?? '')
      setTimeout(() => revalidator.revalidate(), 500)
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data])

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Fragment>
      <Card className='!p-0 mt-4 lg:mt-8'>
        <SiswaKelasDetailMataPelajaranDetailTab
          kelas={loader.kelas}
          mataPelajaran={loader.mataPelajaran}
          activeTabKey={TabKey.ASSIGNMENT}
        />

        <div className='p-4 lg:px-8'>
          <div className='flex flex-row items-center gap-4'>
            <h2 className='font-semibold text-xl'>Detail Tugas</h2>
            <div className='grow' />
            <BackButton buttonProps={{ size: 'sm', variant: 'outlined', color: 'primary' }} />
          </div>
          <hr className='my-4' />
          <SiswaKelasDetailMataPelajaranDetailAssignmentDetailDetailComponent
            assignment={loader.assignment}
            assignmentSubmission={loader.assignmentSubmission}
          />
        </div>
      </Card>

      <Card className='!p-0 mt-4 lg:mt-8'>
        <fetcher.Form method='post' encType='multipart/form-data'>
          <div className='p-4 lg:px-8'>
            <div className='flex flex-row items-center gap-4'>
              <h2 className='font-semibold text-xl'>Submit Tugas</h2>
              <div className='grow' />
            </div>
            <hr className='my-4' />

            <SiswaKelasDetailMataPelajaranDetailAssignmentDetailFormComponent
              assignment={loader.assignment}
              assignmentSubmission={loader.assignmentSubmission}
            />
            <hr className='my-8' />
            <div className='flex flex-row items-center justify-end gap-4'>
              <Button variant='text' color='secondary' label='Kosongkan form' buttonProps={{ type: 'reset' }} />
              <Button
                variant='contained'
                color='primary'
                startIcon={<FaSave />}
                label='Simpan'
                buttonProps={{ disabled: !isSubmitable, type: 'submit' }}
              />
            </div>
          </div>
        </fetcher.Form>
      </Card>
    </Fragment>
  )
}
