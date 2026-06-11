import { useActionData, useFetcher, useLoaderData, useParams, useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaSave } from 'react-icons/fa'
import { useRemixForm } from 'remix-hook-form'
import { Button } from '~/components/forms'
import { Card, LoadingFullScreen } from '~/components/ui'
import DBHelpers from '~/database/helpers'
import useAuthStore from '~/store/authStore'
import { ActionDataGuruManageEkstrakulikulerDetailAssessment } from '~/types/actions-data/guru'
import { LoaderDataGuruManageEkstrakulikulerDetailAssessment } from '~/types/loaders-data/guru'
import GuruManageEkstrakulikulerDetailTab, { TabKey } from '../_components/Tab'
import {
  emptyValues,
  GuruManageEkstrakulikulerDetailAssessmentFormType,
  resolver,
  translateRawToFormData,
} from './form'

const sectionPrefix = 'guru-manage-ekstrakulikuler-detail-assessment'

export default function GuruManageEkstrakulikulerDetailAssessmentPage() {
  const params = useParams()
  const loader = useLoaderData<LoaderDataGuruManageEkstrakulikulerDetailAssessment>()
  const actionData = useActionData<ActionDataGuruManageEkstrakulikulerDetailAssessment>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })
  const user = useAuthStore(state => state.user)

  const formHook = useRemixForm<GuruManageEkstrakulikulerDetailAssessmentFormType>({
    defaultValues: emptyValues,
    mode: 'onChange',
    resolver,
  })

  const resetForm = () => {
    formHook.reset(translateRawToFormData(loader.penilaianEkstrakulikulers))
  }

  useEffect(() => {
    if (loader && loader.penilaianEkstrakulikulers) resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader])

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.message ?? '')
      revalidator.revalidate()
    } else if (actionData?.error) {
      toast.error(actionData.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  function setPenilaian({
    ekstrakulikulerId,
    kompetensiEkstrakulikulerId,
    siswaId,
    nilai,
  }: {
    ekstrakulikulerId: string
    kompetensiEkstrakulikulerId: string
    siswaId: string
    nilai: string
  }) {
    const penilaians = [...formHook.getValues('penilaians')]
    const existingIdx = penilaians.findIndex(
      item =>
        item.ekstrakulikulerId === ekstrakulikulerId &&
        item.kompetensiEkstrakulikulerId === kompetensiEkstrakulikulerId &&
        item.siswaId === siswaId,
    )

    if (existingIdx >= 0) {
      // * Sudah ada, update process
      const existing = penilaians[existingIdx]
      const newData: GuruManageEkstrakulikulerDetailAssessmentFormType['penilaians'][0] = {
        id: existing.id,
        ekstrakulikulerId: existing.ekstrakulikulerId,
        kompetensiEkstrakulikulerId: existing.kompetensiEkstrakulikulerId,
        siswaId: existing.siswaId,
        nilai: Number(nilai),
      }
      const newPenilaians = [...penilaians.filter((_, index) => index !== existingIdx), newData]
      formHook.setValue('penilaians', newPenilaians)
      formHook.trigger('penilaians')
    } else {
      // * Belum ada, insert
      const newData: GuruManageEkstrakulikulerDetailAssessmentFormType['penilaians'][0] = {
        id: null,
        ekstrakulikulerId: ekstrakulikulerId,
        kompetensiEkstrakulikulerId: kompetensiEkstrakulikulerId,
        siswaId: siswaId,
        nilai: Number(nilai),
      }
      const newPenilaians = [...penilaians, newData]
      formHook.setValue('penilaians', newPenilaians)
      formHook.trigger('penilaians')
    }
  }

  function getPenilaian({
    ekstrakulikulerId,
    kompetensiEkstrakulikulerId,
    siswaId,
  }: {
    ekstrakulikulerId: string
    kompetensiEkstrakulikulerId: string
    siswaId: string
  }): GuruManageEkstrakulikulerDetailAssessmentFormType['penilaians'][0] | undefined {
    const penilaians = [...formHook.watch('penilaians')]
    const existing = penilaians.find(
      item =>
        item.ekstrakulikulerId === ekstrakulikulerId &&
        item.kompetensiEkstrakulikulerId === kompetensiEkstrakulikulerId &&
        item.siswaId === siswaId,
    )
    return existing
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='!p-0 mt-4 lg:mt-8'>
      <GuruManageEkstrakulikulerDetailTab ekstrakulikuler={loader.ekstrakulikuler} activeTabKey={TabKey.ASSESSMENT} />

      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <div className='w-full max-w-full overflow-x-auto pb-4 max-h-[400px]'>
          <table className='border-collapse border'>
            <thead className='bg-white'>
              <tr>
                <th className='w-64 min-w-64 sticky top-0 z-20 bg-white border'></th>
                {loader.kompetensiEkstrakulikulers.map(kompetensi => (
                  <th key={kompetensi.id} className='sticky top-0 z-20 bg-white border p-2'>
                    {kompetensi.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loader.siswaPerEkstrakulikulers.map(item => (
                <tr key={item.id}>
                  <td className='sticky left-0 bg-white z-10 border p-2'>
                    {item.siswa ? DBHelpers.akun.getDisplayName(item.siswa) : '-'}
                  </td>
                  {loader.kompetensiEkstrakulikulers.map(kompetensi => {
                    const containerKey = `${item.id}-${kompetensi.id}`
                    const currPenilaian = getPenilaian({
                      ekstrakulikulerId: params.ekstrakulikulerId ?? '',
                      kompetensiEkstrakulikulerId: kompetensi.id,
                      siswaId: item.siswaId,
                    })

                    return (
                      <td key={containerKey} className='border'>
                        <input
                          type='phone'
                          className='w-32 p-2 text-center'
                          min={0}
                          max={100}
                          value={currPenilaian ? String(Number(currPenilaian.nilai)) : ''}
                          onChange={e => {
                            let value = e.target.value
                            value = value.replace(/\D/g, '')
                            value = value.replace(/^0+(?=\d)/, '')

                            if (value === '') {
                              setPenilaian({
                                ekstrakulikulerId: params.ekstrakulikulerId ?? '',
                                kompetensiEkstrakulikulerId: kompetensi.id,
                                siswaId: item.siswaId,
                                nilai: '',
                              })
                              return
                            }
                            let num = Number(value)
                            // clamp ke range 0–100
                            if (num > 100) num = 100
                            if (num < 0) num = 0

                            setPenilaian({
                              ekstrakulikulerId: params.ekstrakulikulerId ?? '',
                              kompetensiEkstrakulikulerId: kompetensi.id,
                              siswaId: item.siswaId,
                              nilai: String(num),
                            })
                          }}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='w-full flex flex-row items-center justify-end gap-4 p-4'>
          <Button variant='text' color='secondary' label='Reset ' buttonProps={{ onClick: resetForm }} />
          <Button
            variant='contained'
            color='primary'
            startIcon={<FaSave />}
            label='Save'
            buttonProps={{ disabled: loader.ekstrakulikuler?.pengajarId !== user?.id, type: 'submit' }}
          />
        </div>
      </fetcher.Form>
    </Card>
  )
}
