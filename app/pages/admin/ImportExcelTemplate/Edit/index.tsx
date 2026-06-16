import { useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { Button } from '~/components/forms'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { ActionDataAdminImportExcelTemplateEdit } from '~/types/actions-data/admin'
import { LoaderDataAdminImportExcelTemplateEdit } from '~/types/loaders-data/admin'
import toast from 'react-hot-toast'
import AdminImportExcelTemplateFormComponent from '../form-component'
import { SYSTEM_IMPORT_EXCEL_TEMPLATE_IDS } from '../form-types'

const sectionPrefix = 'admin-import-excel-template-edit'

export default function AdminImportExcelTemplateEditPage() {
  const loader = useLoaderData<LoaderDataAdminImportExcelTemplateEdit>()
  const fetcher = useFetcher<ActionDataAdminImportExcelTemplateEdit>({
    key: `${sectionPrefix}-form-${loader.importExcelTemplate?.id}`,
  })
  const revalidator = useRevalidator()

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) {
      toast.success(fetcher.data.message ?? '')
      revalidator.revalidate()
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data])

  const isSystemRecord = (SYSTEM_IMPORT_EXCEL_TEMPLATE_IDS as readonly string[]).includes(
    loader.importExcelTemplate?.id ?? '',
  )

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <AdminPageContainer
      title='Edit Import Template'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} to={AppNav.admin.importExcelTemplate()} />]}
    >
      <fetcher.Form method='post' encType='multipart/form-data'>
        <Card className=''>
          <p className='font-semibold text-lg'>Edit Import Template</p>
          <hr className='my-4' />
          <AdminImportExcelTemplateFormComponent
            defaultId={loader.importExcelTemplate?.id}
            defaultTitle={loader.importExcelTemplate?.title}
            defaultRemark={loader.importExcelTemplate?.remark ?? ''}
            currentFileUrl={loader.downloadUrl}
            isSystemRecord={isSystemRecord}
            errors={fetcher.data?.data?.errors}
          />
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
