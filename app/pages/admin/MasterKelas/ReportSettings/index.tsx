import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { ReactNode, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useRemixForm } from 'remix-hook-form'
import { Button, StaticSelect } from '~/components/forms'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import { ReportStatus, SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import { ActionDataAdminMasterKelasReportSettings } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterKelasReportSettings } from '~/types/loaders-data/admin'
import { emptyValues, resolver, AdminMasterKelasReportSettingsFormType } from './form'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import classNames from 'classnames'
import DBHelpers from '~/database/helpers'
import { FaSave } from 'react-icons/fa'

const sectionPrefix = 'admin-master-kelas-report-settings'

const statusOptions = [
  { value: ReportStatus.DRAFT, label: EnumsTitleUtils.reportStatus(ReportStatus.DRAFT) },
  { value: ReportStatus.OPEN, label: EnumsTitleUtils.reportStatus(ReportStatus.OPEN) },
  { value: ReportStatus.CLOSED, label: EnumsTitleUtils.reportStatus(ReportStatus.CLOSED) },
]

export default function AdminMasterKelasReportSettingsPage() {
  const loader = useLoaderData<LoaderDataAdminMasterKelasReportSettings>()
  const actionData = useActionData<ActionDataAdminMasterKelasReportSettings>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<AdminMasterKelasReportSettingsFormType>({
    defaultValues: {
      status: (loader.reportConfig?.status as ReportStatus) ?? emptyValues.status,
    },
    resolver,
  })

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.message ?? 'Report settings updated!')
      revalidator.revalidate()
    } else if (actionData?.error) {
      toast.error(actionData.message ?? 'Something went wrong.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  const semesterLabel = loader.semesterAjaran
    ? `${EnumsTitleUtils.getSemesterAjaranUrutan(loader.semesterAjaran.urutan as SemesterAjaranUrutan)} Semester`
    : '-'

  function DetailItem({ label, colSpan = 1, children }: { label?: ReactNode; colSpan?: number; children?: ReactNode }) {
    return (
      <div
        className={classNames('col-span-3 h-full', {
          ['lg:col-span-1']: colSpan === 1,
          ['lg:col-span-2']: colSpan === 2,
        })}
      >
        <div className='text-sm font-semibold'>{label}</div>
        <div className='border-b py-2 px-1'>{children}</div>
      </div>
    )
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <AdminPageContainer title='Report Settings' actions={[<BackButton key={`${sectionPrefix}-back`} />]}>
      <Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-6'>
          <DetailItem colSpan={1} label='Academic Year'>
            {semesterLabel}
          </DetailItem>
          <DetailItem colSpan={1} label='Academic Semester'>
            {semesterLabel}
          </DetailItem>
          <DetailItem colSpan={1} label='Class'>
            {loader.kelas?.nama ?? '-'}
          </DetailItem>
          <DetailItem colSpan={1} label='Homeroom Teacher'>
            {loader.kelas?.wali ? DBHelpers.akun.generateUsername(loader.kelas.wali) : '-'}
          </DetailItem>
        </div>

        <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
          <div className='mb-4'>
            <StaticSelect
              label='Report Status'
              options={statusOptions}
              selectProps={{
                value: formHook.watch('status'),
                onChange: e => formHook.setValue('status', e.target.value as ReportStatus, { shouldDirty: true }),
              }}
            />
            {formHook.formState.errors.status?.message && (
              <p className='text-red-500 text-sm mt-1'>{formHook.formState.errors.status.message}</p>
            )}
          </div>

          <div className='bg-gray-100 rounded-lg p-4 mb-4 text-sm'>
            <p className='font-semibold mb-2'>Status Guide:</p>
            <ul className='list-disc list-inside space-y-1 text-gray-600'>
              <li>
                <strong>Draft</strong> – Report period has not started. Teachers cannot edit report data.
              </li>
              <li>
                <strong>Open</strong> – Teachers may edit competency descriptions and homeroom notes.
              </li>
              <li>
                <strong>Closed</strong> – Report data is read-only. Reports can still be previewed and printed.
              </li>
            </ul>
          </div>

          <div className='flex flex-row items-center justify-end gap-4'>
            <Button
              label='Save Settings'
              color='primary'
              startIcon={<FaSave />}
              buttonProps={{ type: 'submit', disabled: formHook.formState.isSubmitting }}
            />
          </div>
        </fetcher.Form>
      </Card>
    </AdminPageContainer>
  )
}
