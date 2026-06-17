import { useActionData, useFetcher, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react'
import { ReactNode, useEffect } from 'react'
import { useRemixForm } from 'remix-hook-form'
import toast from 'react-hot-toast'
import { Button, TextAreaInput } from '~/components/forms'
import { Card, LoadingFullScreen } from '~/components/ui'
import { ActionDataGuruHomeroomNotesEdit } from '~/types/actions-data/guru'
import { LoaderDataGuruHomeroomNotesEdit } from '~/types/loaders-data/guru'
import { GuruHomeroomNoteEditFormType, resolver } from './form'
import { FaSave } from 'react-icons/fa'
import classNames from 'classnames'
import GuruDaftarKelasDetailTab, { TabKey } from '../../_components/Tab'

const sectionPrefix = 'guru-homeroom-notes-edit'

export default function GuruHomeroomNotesEditPage() {
  const loader = useLoaderData<LoaderDataGuruHomeroomNotesEdit>()
  const actionData = useActionData<ActionDataGuruHomeroomNotesEdit>()
  const navigate = useNavigate()
  const revalidator = useRevalidator()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<GuruHomeroomNoteEditFormType>({
    defaultValues: {
      siswaId: loader.siswa?.id ?? '',
      semesterAjaranId: loader.semesterAjaranId ?? '',
      homeroomTeacherNote: loader.studentReport?.homeroomTeacherNote ?? '',
    },
    resolver,
  })

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.message ?? 'Note saved!')
      navigate(-1)
    } else if (actionData?.error) {
      toast.error(actionData.message ?? 'Something went wrong.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  const studentName = loader.siswa ? `${loader.siswa.firstName} ${loader.siswa.lastName}` : '-'

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
    <Card className='p-0! mt-4 md:mt-8'>
      <GuruDaftarKelasDetailTab kelas={loader.kelas} activeTabKey={TabKey.HOMEROOM_NOTES} />

      <fetcher.Form method='post' onSubmit={formHook.handleSubmit} className='p-4 md:p-8 md:pb-4'>
        <input type='hidden' {...formHook.register('siswaId')} />
        <input type='hidden' {...formHook.register('semesterAjaranId')} />

        <div className='grid grid-cols-2 gap-4 md:gap-8'>
          <DetailItem colSpan={1} label='Student'>
            {studentName}
          </DetailItem>
          <DetailItem colSpan={1} label='Class'>
            {loader.kelas?.nama ?? '-'}
          </DetailItem>
          <DetailItem colSpan={2} label='Homeroom Teacher Note'>
            <TextAreaInput
              inputProps={{
                ...formHook.register('homeroomTeacherNote'),
                rows: 6,
                placeholder: 'Write homeroom teacher note here...',
              }}
            />
            {formHook.formState.errors.homeroomTeacherNote?.message && (
              <p className='text-red-500 text-sm mt-1'>{formHook.formState.errors.homeroomTeacherNote.message}</p>
            )}
          </DetailItem>
        </div>

        <div className='flex flex-row items-center gap-2 justify-end mt-4'>
          <Button
            label='Save Note'
            color='primary'
            startIcon={<FaSave />}
            buttonProps={{ type: 'submit', disabled: formHook.formState.isSubmitting }}
          />
        </div>
      </fetcher.Form>
    </Card>
  )
}
