import { useActionData, useFetcher, useLoaderData, useParams, useRevalidator } from '@remix-run/react'
import { Fragment, useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { useRemixForm } from 'remix-hook-form'
import { Button, TextInput } from '~/components/forms'
import { BackButton, Card } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { AdminMasterKelasManageJadwalFormType, resolver, emptyValues } from './form'
import { ActionDataAdminMasterKelasManageJadwal } from '~/types/actions-data/admin'
import toast from 'react-hot-toast'
import { LoaderDataAdminMasterKelasManageJadwal } from '~/types/loaders-data/admin'
import classNames from 'classnames'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import DBHelpers from '~/database/helpers'

const sectionPrefix = 'admin-master-kelas-manage-jadwal'

export default function AdminMasterKelasManageJadwalPage() {
  const params = useParams()
  const loader = useLoaderData<LoaderDataAdminMasterKelasManageJadwal>()
  const actionData = useActionData<ActionDataAdminMasterKelasManageJadwal>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<AdminMasterKelasManageJadwalFormType>({
    defaultValues: emptyValues,
    mode: 'onChange',
    resolver,
  })

  function resetForm() {
    formHook.reset()
  }

  useEffect(() => {
    if (loader && loader.kelas) {
      formHook.reset({ kelasId: loader.kelas.id, jadwalPelajarans: loader.kelas.jadwalPelajarans })
    }
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

  function setMapel(dayId: string, hourId: string, mapelId: string) {
    const jadwalPelajarans = [...formHook.getValues('jadwalPelajarans')]
    const existingIdx = jadwalPelajarans.findIndex(item => item.dayId === dayId && item.hourId === hourId)

    if (existingIdx >= 0) {
      // * Existing -> Updating
      const existing = jadwalPelajarans[existingIdx]
      const newData: AdminMasterKelasManageJadwalFormType['jadwalPelajarans'][0] = {
        id: existing.id,
        jadwalPelajaranId: existing.jadwalPelajaranId,
        mataPelajaranId: mapelId,
        dayId: existing.dayId,
        hourId: existing.hourId,
      }
      const newJadwalPelajarans = [...jadwalPelajarans.filter((_, index) => index !== existingIdx), newData]
      formHook.setValue('jadwalPelajarans', newJadwalPelajarans)
      formHook.trigger('jadwalPelajarans')
    } else {
      // * Not Existing -> Inserting
      const newData: AdminMasterKelasManageJadwalFormType['jadwalPelajarans'][0] = {
        id: null,
        mataPelajaranId: mapelId,
        dayId: dayId,
        hourId: hourId,
      }
      const newJadwalPelajarans = [...jadwalPelajarans, newData]
      formHook.setValue('jadwalPelajarans', newJadwalPelajarans)
      formHook.trigger('jadwalPelajarans')
    }
  }

  function getMapel(
    dayId: string,
    hourId: string,
  ): AdminMasterKelasManageJadwalFormType['jadwalPelajarans'][0] | undefined {
    const jadwalPelajarans = [...formHook.watch('jadwalPelajarans')]
    const existing = jadwalPelajarans.find(item => item.dayId === dayId && item.hourId === hourId)
    return existing
  }

  return (
    <AdminPageContainer
      title='Manage Jadwal Pelajaran'
      actions={[<BackButton key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterKelas()} />]}
    >
      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <Card className=''>
          <div className='w-full mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='col-span-1'>
              <TextInput
                label='Kelas'
                inputProps={{
                  value: loader.kelas?.nama,
                }}
              />
            </div>
            <div className='col-span-1'>
              <TextInput label='Tahun Ajaran' inputProps={{ value: loader.kelas?.tahunAjaran.nama }} />
            </div>
            <div className='col-span-1'>
              <TextInput
                label='Semester Ajaran'
                inputProps={{
                  value: EnumsTitleUtils.getSemesterAjaranUrutan(
                    loader.kelas?.tahunAjaran.semesterAjaran.find(item => item.id === params.semesterAjaranId)
                      ?.urutan as SemesterAjaranUrutan,
                  ),
                }}
              />
            </div>
            <div className='col-span-1'>
              <TextInput
                label='Wali Kelas'
                inputProps={{
                  value: loader.kelas?.wali ? DBHelpers.akun.getDisplayName(loader.kelas.wali) : '-',
                }}
              />
            </div>
          </div>

          <div className='overflow-x-auto relative mb-4'>
            <div className='w-full min-w-xl grid grid-cols-7 mb-1'>
              <div className='col-span-1 rounded-tl-lg border h-12 sticky left-0 bg-grey-light/90'></div>
              {loader.days.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className={classNames('col-span-1 border h-12 flex items-center justify-center', {
                    ['rounded-tr-lg']: dayIdx === loader.days.length - 1,
                  })}
                >
                  <p className='font-semibold'>{day.label}</p>
                </div>
              ))}
              {loader.hours.map((hour, hourIdx) => (
                <Fragment key={hourIdx}>
                  <div
                    className={classNames(
                      'col-span-1 border flex items-center justify-center h-12 sticky left-0 bg-grey-light/90',
                      {
                        ['rounded-bl-lg']: hourIdx === loader.hours.length - 1,
                      },
                    )}
                  >
                    <p className='font-semibold'>{hour.label}</p>
                  </div>
                  {loader.days.map((day, dayIdx) => (
                    <div
                      key={`${hourIdx}-${dayIdx}`}
                      className={classNames('col-span-1 border h-12 overflow-auto', {
                        ['rounded-br-lg']: dayIdx === loader.days.length - 1 && hourIdx === loader.hours.length - 1,
                      })}
                    >
                      <select
                        className='w-full min-h-11 whitespace-pre-wrap'
                        value={getMapel(day.id, hour.id)?.mataPelajaranId ?? ''}
                        onChange={e => setMapel(day.id, hour.id, e.target.value)}
                      >
                        <option value=''></option>
                        {loader.mataPelajarans.map((mapel, mapelIdx) => (
                          <option key={mapelIdx} value={mapel.id}>
                            {mapel.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>

          <div className='w-full flex flex-row items-center justify-end gap-4'>
            <Button variant='text' color='secondary' label='Reset ' buttonProps={{ onClick: resetForm }} />
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
    </AdminPageContainer>
  )
}
