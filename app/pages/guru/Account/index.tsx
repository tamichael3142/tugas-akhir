import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import GuruAccountSelfUpdateFormComponent from './form-component'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { GuruAccountSelfUpdateFormType, resolver, defaultValues, translateRawToFormData } from './form'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button } from '~/components/forms'
import { FaSave } from 'react-icons/fa'
import GuruAccountSelfUpdateDetailComponent from './detail-component'
import { LoaderDataGuruAccount } from '~/types/loaders-data/guru'
import { ActionDataGuruAccountSelfUpdate } from '~/types/actions-data/guru'

const sectionPrefix = 'guru-account'

export default function GuruAccountPage() {
  const loader = useLoaderData<LoaderDataGuruAccount>()
  const actionData = useActionData<ActionDataGuruAccountSelfUpdate>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<GuruAccountSelfUpdateFormType>({
    defaultValues,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    formHook.reset()
  }

  useEffect(() => {
    formHook.reset(translateRawToFormData(loader.account))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader.account])

  useEffect(() => {
    if (actionData?.success) {
      resetForm()
      toast.success(actionData.message ?? '')
      revalidator.revalidate()
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  if (revalidator.state === 'loading' || !loader.account) return <LoadingFullScreen />
  return (
    <GuruPageContainer
      title='Manage Account'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} label='Back' buttonProps={{ color: 'primary' }} />]}
    >
      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <Card>
          <p className='font-semibold text-lg'>Permanent Data</p>
          <hr className='my-4' />
          <GuruAccountSelfUpdateDetailComponent account={loader.account} />

          <p className='font-semibold text-lg'>Edit Info</p>
          <hr className='my-4' />
          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <GuruAccountSelfUpdateFormComponent account={loader.account} />
          </RemixFormProvider>

          <hr className='my-8' />
          <div className='flex flex-row items-center justify-end gap-4'>
            <Button variant='text' color='secondary' label='Reset form' buttonProps={{ onClick: resetForm }} />
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
    </GuruPageContainer>
  )
}
