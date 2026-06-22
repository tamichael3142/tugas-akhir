import { useActionData, useFetcher, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import AppNav from '~/navigation'
import { LoaderDataGuruManageViolationsEdit } from '~/types/loaders-data/guru'
import { ActionDataGuruManageViolationsEdit } from '~/types/actions-data/guru'
import { emptyValues, resolver, GuruManageViolationsCreateFormType, translateRawToFormData } from '../Create/form'
import toast from 'react-hot-toast'
import GuruManageViolationsFormComponent from '../form-component'

const sectionPrefix = 'guru-manage-violations-edit'

export default function GuruManageViolationsEditPage() {
  const loader = useLoaderData<LoaderDataGuruManageViolationsEdit>()
  const actionData = useActionData<ActionDataGuruManageViolationsEdit>()
  const navigate = useNavigate()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form-${loader.pelanggaran?.id}` })
  const revalidator = useRevalidator()

  const formHook = useRemixForm<GuruManageViolationsCreateFormType>({
    defaultValues: emptyValues,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    if (loader.pelanggaran) formHook.reset(translateRawToFormData(loader.pelanggaran))
  }

  useEffect(() => {
    if (loader.pelanggaran) resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader.pelanggaran])

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.message ?? '')
      navigate(AppNav.guru.manageViolations())
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <GuruPageContainer
      title='Edit Violation'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} to={AppNav.guru.manageViolations()} />]}
    >
      <RemixFormProvider key={`${sectionPrefix}-form-${loader.pelanggaran?.id}`} {...formHook}>
        <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
          <Card>
            <p className='font-semibold text-lg'>Edit Violation</p>
            <hr className='my-4' />

            <GuruManageViolationsFormComponent siswas={loader.siswas} kelass={loader.kelass} />
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
      </RemixFormProvider>
    </GuruPageContainer>
  )
}
