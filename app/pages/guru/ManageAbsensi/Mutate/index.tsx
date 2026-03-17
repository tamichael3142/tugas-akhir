import { useActionData, useFetcher, useLoaderData, useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { Button, Radio } from '~/components/forms'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import GuruPageContainer from '~/layouts/guru/GuruPageContainer'
import { ActionDataGuruManageAbsensiMutate } from '~/types/actions-data/guru'
import toast from 'react-hot-toast'
import { LoaderDataGuruManageAbsensiMutate } from '~/types/loaders-data/guru'
import { GuruManageAbsensiMutateFormType } from '../form-types'
import { emptyUserValue, resolver, translateRawToFormData } from './form'
import DBHelpers from '~/database/helpers'
import classNames from 'classnames'
import { TipeAbsensi } from '~/database/enums/prisma.enums'
import EnumsTitleUtils from '~/utils/enums-title.utils'

const sectionPrefix = 'guru-manage-absensi-mutate'

const absenOptions = [TipeAbsensi.HADIR, TipeAbsensi.IZIN, TipeAbsensi.SAKIT, TipeAbsensi.TANPA_KETERANGAN]

export default function GuruManageAbsensiMutatePage() {
  const loader = useLoaderData<LoaderDataGuruManageAbsensiMutate>()
  const actionData = useActionData<ActionDataGuruManageAbsensiMutate>()
  const fetcher = useFetcher({ key: `${sectionPrefix}-mutate-form-${loader.absensi?.id}` })
  const revalidator = useRevalidator()

  const formHook = useRemixForm<GuruManageAbsensiMutateFormType>({
    defaultValues: emptyUserValue,
    mode: 'onChange',
    resolver,
  })

  const siswaTerabsenWatcher = formHook.watch('siswaTerabsen')

  function resetForm() {
    if (loader && loader.absensi)
      formHook.reset(
        translateRawToFormData({
          siswaPerKelasPerSemesters: loader.siswaPerKelasPerSemesters,
          siswaTerabsen: loader.absensi.siswaTerabsen,
        }),
      )
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

  const getSiswaFromLoader = (siswaId?: string | null) => {
    if (!siswaId) return null
    return loader.siswaPerKelasPerSemesters.find(item => item.siswaId === siswaId)?.siswa
  }

  const updateTipeState = (siswaId: string, tipe: TipeAbsensi) => {
    const oldValues = [...formHook.getValues('siswaTerabsen')]
    const newValues: GuruManageAbsensiMutateFormType['siswaTerabsen'] = []

    for (let i = 0; i < oldValues.length; i++) {
      const currValue = oldValues[i]
      if (currValue.siswaId === siswaId) newValues.push({ ...currValue, tipe })
      else newValues.push(currValue)
    }

    formHook.setValue('siswaTerabsen', newValues)
    formHook.trigger('siswaTerabsen')
  }

  const updateAllTipeState = (tipe: TipeAbsensi) => {
    const oldValues = [...formHook.getValues('siswaTerabsen')]
    const newValues: GuruManageAbsensiMutateFormType['siswaTerabsen'] = []

    for (let i = 0; i < oldValues.length; i++) {
      const currValue = oldValues[i]
      newValues.push({ ...currValue, tipe })
    }

    formHook.setValue('siswaTerabsen', newValues)
    formHook.trigger('siswaTerabsen')
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <GuruPageContainer title='Absen Siswa' actions={[<BackButton key={`${sectionPrefix}-back-button`} />]}>
      <RemixFormProvider key={`${sectionPrefix}-form-${loader.absensi?.id}`} {...formHook}>
        <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
          <Card className=''>
            <div className='overflow-x-auto relative mb-4'>
              <div className='w-full min-w-xl flex flex-col'>
                <div className='w-full min-w-xl flex flex-row'>
                  <div className={classNames('border p-4 bg-grey-light/90 font-bold w-20 rounded-tl-lg')}></div>
                  <div className='flex flex-col lg:flex-row grow'>
                    <div className={classNames('border p-4 bg-grey-light/90 flex-1 font-bold text-xl')}>
                      {'Pilih semua'}
                    </div>
                    <div className={classNames('border p-4 bg-grey-light/90 rounded-tr-lg flex-1')}>
                      <div className='flex flex-row items-center justify-between flex-wrap gap-4'>
                        {absenOptions.map(opt => {
                          return (
                            <Button
                              key={opt}
                              label={EnumsTitleUtils.getTipeAbsensi(opt)}
                              size='sm'
                              variant='outlined'
                              color='secondary'
                              buttonProps={{
                                onClick: () => updateAllTipeState(opt),
                              }}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {siswaTerabsenWatcher.map((item, index) => {
                  const siswa = getSiswaFromLoader(item.siswaId)

                  return (
                    <div key={item.siswaId} className='w-full min-w-xl flex flex-row'>
                      <div
                        className={classNames('border p-4 bg-grey-light/90 font-bold w-20', {
                          ['rounded-bl-lg']: index === loader.siswaPerKelasPerSemesters.length - 1,
                        })}
                      >
                        {index + 1}.
                      </div>
                      <div className='flex flex-col lg:flex-row grow'>
                        <div className={classNames('border p-4 bg-grey-light/90 flex-1')}>
                          {siswa ? DBHelpers.akun.getDisplayName(siswa) : null}
                        </div>
                        <div
                          className={classNames('border p-4 bg-grey-light/90 flex-1', {
                            ['rounded-br-lg']: index === loader.siswaPerKelasPerSemesters.length - 1,
                          })}
                        >
                          <div className='flex flex-row items-center justify-between flex-wrap gap-4'>
                            {absenOptions.map(opt => {
                              const inputName = `${item.siswaId}-absen`
                              return (
                                <Radio
                                  key={opt}
                                  label={EnumsTitleUtils.getTipeAbsensi(opt)}
                                  inputProps={{
                                    name: inputName,
                                    id: `${inputName}-${opt}`,
                                    checked: opt === item.tipe,
                                    onChange: () => updateTipeState(item.siswaId ?? '', opt),
                                  }}
                                />
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

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
