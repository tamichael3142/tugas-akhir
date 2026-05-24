import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import OrtuAccountSelfUpdateFormComponent from './form-component'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { OrtuAccountSelfUpdateFormType, resolver, defaultValues, translateRawToFormData } from './form'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button } from '~/components/forms'
import { FaSave } from 'react-icons/fa'
import OrtuAccountSelfUpdateDetailComponent from './detail-component'
import { LoaderDataOrtuAccount } from '~/types/loaders-data/ortu'
import { ActionDataOrtuAccountSelfUpdate } from '~/types/actions-data/ortu'

const sectionPrefix = 'ortu-account'

export default function OrtuAccountPage() {
  const loader = useLoaderData<LoaderDataOrtuAccount>()
  const actionData = useActionData<ActionDataOrtuAccountSelfUpdate>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<OrtuAccountSelfUpdateFormType>({
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
      actions={[<BackButton key={`${sectionPrefix}-back-button`} label='Back' buttonProps={{ color: 'secondary' }} />]}
    >
      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <Card>
          <p className='font-semibold text-lg'>Permanent Data</p>
          <hr className='my-4' />
          <OrtuAccountSelfUpdateDetailComponent account={loader.account} />

          <p className='font-semibold text-lg'>Edit Info</p>
          <hr className='my-4' />
          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <OrtuAccountSelfUpdateFormComponent account={loader.account} />
          </RemixFormProvider>

          <hr className='my-8' />
          <div className='flex flex-row items-center justify-end gap-4'>
            <Button variant='text' color='primary' label='Reset form' buttonProps={{ onClick: resetForm }} />
            <Button
              variant='contained'
              color='secondary'
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
