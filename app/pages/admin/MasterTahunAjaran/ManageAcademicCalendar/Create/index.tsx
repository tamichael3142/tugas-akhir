import { useActionData, useFetcher, useLoaderData, useParams, useRevalidator } from '@remix-run/react'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { FaSave } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { AcademicCalendarCard, BackButton, Card, LoadingFullScreen } from '~/components/ui'
import constants from '~/constants'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { ActionDataAdminMasterTahunAjaranAcademicCalendarEventCreate } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterTahunAjaranManageAcademicCalendarCreate } from '~/types/loaders-data/admin'
import AcademicCalendarEventFormComponent from '../form-component'
import { AcademicCalendarEventFormType, createResolver, emptyFormValue } from './form'

const sectionPrefix = 'admin-manage-academic-calendar-create'

export default function AdminMasterTahunAjaranManageAcademicCalendarCreatePage() {
  const loader = useLoaderData<LoaderDataAdminMasterTahunAjaranManageAcademicCalendarCreate>()
  const actionData = useActionData<ActionDataAdminMasterTahunAjaranAcademicCalendarEventCreate>()
  const revalidator = useRevalidator()
  const { tahunAjaranId } = useParams()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })
  const [calendarKey, setCalendarKey] = useState(0)

  const tahunMulaiStr = loader.tahunAjaran?.tahunMulai
    ? format(new Date(loader.tahunAjaran.tahunMulai), constants.dateFormats.rawDateInput)
    : ''
  const tahunBerakhirStr = loader.tahunAjaran?.tahunBerakhir
    ? format(new Date(loader.tahunAjaran.tahunBerakhir), constants.dateFormats.rawDateInput)
    : ''

  const formHook = useRemixForm<AcademicCalendarEventFormType>({
    defaultValues: emptyFormValue,
    mode: 'onChange',
    resolver: createResolver(tahunMulaiStr, tahunBerakhirStr),
  })

  function resetForm() {
    formHook.reset()
  }

  useEffect(() => {
    if (actionData?.success) {
      resetForm()
      toast.success(actionData.message ?? '')
      revalidator.revalidate()
      setCalendarKey(k => k + 1)
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  if (fetcher.state === 'loading') return <LoadingFullScreen />
  return (
    <AdminPageContainer
      title='Add Academic Calendar Event'
      actions={[
        <BackButton
          key={`${sectionPrefix}-back-button`}
          to={AppNav.admin.masterTahunAjaranManageAcademicCalendar({ id: tahunAjaranId ?? '' })}
        />,
      ]}
    >
      <AcademicCalendarCard key={calendarKey} currentTahunAjaran={loader.tahunAjaran} className='mb-4 md:mb-8' />

      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <Card>
          <p className='font-semibold text-lg'>Add Event</p>
          <hr className='my-4' />
          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <AcademicCalendarEventFormComponent dateBounds={{ min: tahunMulaiStr, max: tahunBerakhirStr }} />
          </RemixFormProvider>
          <hr className='my-8' />
          <div className='flex flex-row items-center justify-end gap-4'>
            <Button variant='text' color='secondary' label='Empty form' buttonProps={{ onClick: resetForm }} />
            <Button
              variant='contained'
              color='primary'
              startIcon={<FaSave />}
              label='Save'
              buttonProps={{ type: 'submit' }}
            />
          </div>
        </Card>
      </fetcher.Form>
    </AdminPageContainer>
  )
}
