import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import { ActionDataGuruManageAbsensiEdit } from '~/types/actions-data/guru'
import toast from 'react-hot-toast'
import { LoaderDataGuruManageAbsensiMutate } from '~/types/loaders-data/guru'
import { GuruManageAbsensiMutateFormType } from '../form-types'
import { emptyUserValue, resolver, translateRawToFormData } from './form'
import DBHelpers from '~/database/helpers'

const sectionPrefix = 'guru-manage-absensi-mutate'

export default function GuruManageAbsensiMutatePage() {
  const loader = useLoaderData<LoaderDataGuruManageAbsensiMutate>()
  const actionData = useActionData<ActionDataGuruManageAbsensiEdit>()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form-${loader.absensi?.id}` })
  const revalidator = useRevalidator()

  console.log(loader.siswaPerKelasPerSemesters)

  const formHook = useRemixForm<GuruManageAbsensiMutateFormType>({
    defaultValues: emptyUserValue,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    if (loader && loader.absensi) formHook.reset(translateRawToFormData(loader.absensi))
  }

  useEffect(() => {
    if (loader && loader.absensi) resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader])

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

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <GuruPageContainer title='Absen Siswa' actions={[<BackButton key={`${sectionPrefix}-back-button`} />]}>
      <RemixFormProvider key={`${sectionPrefix}-form-${loader.absensi?.id}`} {...formHook}>
        <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
          <Card className=''>
            <div>
              {loader.siswaPerKelasPerSemesters.map(item => (
                <div key={item.id}>{item.siswa ? <div>{DBHelpers.akun.getDisplayName(item.siswa)}</div> : null}</div>
              ))}
            </div>

            <hr className='my-8' />
            <div className='flex flex-row items-center justify-end gap-4'>
              <Button variant='text' color='secondary' label='Reset form' buttonProps={{ onClick: resetForm }} />
              <Button
                variant='contained'
                color='primary'
                startIcon={<FaSave />}
                label='Simpan'
                buttonProps={{ type: 'submit' }}
              />
            </div>
          </Card>
        </fetcher.Form>
      </RemixFormProvider>
    </GuruPageContainer>
  )
}
