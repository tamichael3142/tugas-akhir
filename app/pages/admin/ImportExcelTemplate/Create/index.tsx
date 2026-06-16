import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { Button } from '~/components/forms'
import { BackButton, Card } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { ActionDataAdminImportExcelTemplateCreate } from '~/types/actions-data/admin'
import { LoaderDataAdminImportExcelTemplateCreate } from '~/types/loaders-data/admin'
import toast from 'react-hot-toast'
import AdminImportExcelTemplateFormComponent from '../form-component'

const sectionPrefix = 'admin-import-excel-template-create'

export default function AdminImportExcelTemplateCreatePage() {
  const loader = useLoaderData<LoaderDataAdminImportExcelTemplateCreate>()
  const navigate = useNavigate()
  const fetcher = useFetcher<ActionDataAdminImportExcelTemplateCreate>({ key: `${sectionPrefix}-form` })

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) {
      toast.success(fetcher.data.message ?? '')
      navigate(AppNav.admin.importExcelTemplate())
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data])

  return (
    <AdminPageContainer
      title='Create Import Template'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} to={AppNav.admin.importExcelTemplate()} />]}
    >
      <fetcher.Form method='post' encType='multipart/form-data'>
        <Card className=''>
          <p className='font-semibold text-lg'>Add Import Template</p>
          <hr className='my-4' />
          <AdminImportExcelTemplateFormComponent defaultId={loader.defaultId} errors={fetcher.data?.data?.errors} />
          <hr className='my-8' />
          <div className='flex flex-row items-center justify-end gap-4'>
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
