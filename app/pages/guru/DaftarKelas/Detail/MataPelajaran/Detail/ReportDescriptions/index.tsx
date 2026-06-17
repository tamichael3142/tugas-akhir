import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'
import { useRemixForm } from 'remix-hook-form'
import toast from 'react-hot-toast'
import { Button, TextAreaInput } from '~/components/forms'
import { Card, LoadingFullScreen } from '~/components/ui'
import { ReportStatus } from '~/database/enums/prisma.enums'
import { ActionDataGuruReportDescriptions } from '~/types/actions-data/guru'
import { LoaderDataGuruReportDescriptions } from '~/types/loaders-data/guru'
import GuruManageMataPelajaranDetailTab, { TabKey } from '../_components/Tab'
import { emptyValues, GuruReportDescriptionsFormType, resolver } from './form'
import { FaSave } from 'react-icons/fa'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import classNames from 'classnames'

const sectionPrefix = 'guru-report-descriptions'

export default function GuruReportDescriptionsPage() {
  const loader = useLoaderData<LoaderDataGuruReportDescriptions>()
  const actionData = useActionData<ActionDataGuruReportDescriptions>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const isReadOnly =
    !loader.reportConfig ||
    loader.reportConfig.status === ReportStatus.DRAFT ||
    loader.reportConfig.status === ReportStatus.CLOSED

  const formHook = useRemixForm<GuruReportDescriptionsFormType>({
    defaultValues: emptyValues,
    resolver,
  })

  const resetForm = () => {
    formHook.reset({
      descriptions: loader.siswaPerKelasPerSemesters.map(spks => {
        const existing = loader.studentSubjectReports.find(r => r.siswaId === spks.siswaId)
        return {
          id: existing?.id ?? null,
          siswaId: spks.siswaId,
          semesterAjaranId: loader.mataPelajaran.semesterAjaranId,
          mataPelajaranId: loader.mataPelajaran.id,
          description: existing?.description ?? '',
        }
      }),
    })
  }

  useEffect(() => {
    if (loader) resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader])

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.message ?? 'Descriptions saved!')
      revalidator.revalidate()
    } else if (actionData?.error) {
      toast.error(actionData.message ?? 'Something went wrong.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  const descriptions = formHook.watch('descriptions')
  const reportStatusBadge: Record<string, string> = {
    DRAFT: 'text-grey-500',
    OPEN: 'text-green-500',
    CLOSED: 'text-red-500',
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='p-0! mt-4 md:mt-8' key={`${sectionPrefix}-card`}>
      <GuruManageMataPelajaranDetailTab
        activeTabKey={TabKey.REPORT_DESCRIPTIONS}
        kelas={loader.kelas!}
        mataPelajaran={loader.mataPelajaran}
      />

      <div className='p-4 md:p-8'>
        <div className='mb-4'>
          <h4 className='font-semibold text-lg'>Competency Achievement Descriptions</h4>
          {loader.reportConfig && (
            <p className={classNames(reportStatusBadge[loader.reportConfig.status])}>
              Status: {EnumsTitleUtils.reportStatus(loader.reportConfig.status as never)}
            </p>
          )}
        </div>

        {isReadOnly && (
          <div className='bg-secondary/10 border border-secondary text-secondary font-semibold rounded-lg p-2 mb-4'>
            <span>
              {!loader.reportConfig || loader.reportConfig.status === ReportStatus.DRAFT
                ? 'Report period is not open yet. You cannot edit descriptions at this time.'
                : 'Report period is closed. Descriptions are read-only.'}
            </span>
          </div>
        )}

        <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
          <div className='overflow-x-auto'>
            <table className='table w-full box-border'>
              <thead>
                <tr className='bg-neutral-100'>
                  <th className='w-8 border p-2'>No</th>
                  <th className='w-40 border p-2'>Student Name</th>
                  <th className='border p-2'>Competency Achievement Description</th>
                </tr>
              </thead>
              <tbody>
                {loader.siswaPerKelasPerSemesters.map((spks, idx) => (
                  <tr key={spks.siswaId}>
                    <td className='align-top border p-2 text-center'>{idx + 1}</td>
                    <td className='align-top border p-2'>
                      {spks.siswa.firstName} {spks.siswa.lastName}
                    </td>
                    <td className='border p-2'>
                      {isReadOnly ? (
                        <p>{descriptions[idx]?.description ? descriptions[idx]?.description : '-'}</p>
                      ) : (
                        <TextAreaInput
                          className='textarea textarea-bordered w-full text-sm'
                          inputProps={{
                            rows: 3,
                            placeholder: 'Write competency description...',
                            ...formHook.register(`descriptions.${idx}.description`),
                            value: descriptions[idx]?.description ?? '',
                            onChange: e => formHook.setValue(`descriptions.${idx}.description`, e.target.value),
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!isReadOnly && (
            <div className='mt-4 flex flex-row items-center justify-end gap-4'>
              <Button
                label='Save Descriptions'
                color='primary'
                startIcon={<FaSave />}
                buttonProps={{ type: 'submit', disabled: formHook.formState.isSubmitting }}
              />
            </div>
          )}
        </fetcher.Form>
      </div>
    </Card>
  )
}
