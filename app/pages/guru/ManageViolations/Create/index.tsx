import { useActionData, useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { BackButton, Card } from '~/components/ui'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import AppNav from '~/navigation'
import { LoaderDataGuruManageViolationsCreate } from '~/types/loaders-data/guru'
import { ActionDataGuruManageViolationsCreate } from '~/types/actions-data/guru'
import { emptyValues, resolver, GuruManageViolationsCreateFormType } from './form'
import toast from 'react-hot-toast'
import GuruManageViolationsFormComponent from '../form-component'

const sectionPrefix = 'guru-manage-violations-create'

export default function GuruManageViolationsCreatePage() {
  const loader = useLoaderData<LoaderDataGuruManageViolationsCreate>()
  const actionData = useActionData<ActionDataGuruManageViolationsCreate>()
  const navigate = useNavigate()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<GuruManageViolationsCreateFormType>({
    defaultValues: emptyValues,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    formHook.reset({ ...emptyValues })
  }

  useEffect(() => {
    if (actionData?.success) {
      resetForm()
      toast.success(actionData.message ?? '')
      navigate(AppNav.guru.manageViolations())
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  return (
    <GuruPageContainer
      title='Create Violation'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} to={AppNav.guru.manageViolations()} />]}
    >
      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <Card>
          <p className='font-semibold text-lg'>Add Violation</p>
          <hr className='my-4' />

          <RemixFormProvider key={`${sectionPrefix}-form`} {...formHook}>
            <GuruManageViolationsFormComponent
              siswas={loader.siswas}
              kelass={loader.kelass}
            />
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
    </GuruPageContainer>
  )
}
