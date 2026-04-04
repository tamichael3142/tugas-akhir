import { useActionData, useFetcher, useLoaderData, useParams, useRevalidator } from '@remix-run/react'
import { Card, LoadingFullScreen } from '~/components/ui'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPenilaian } from '~/types/loaders-data/guru'
import GuruManageMataPelajaranDetailTab, { TabKey } from '../_components/Tab'
import DBHelpers from '~/database/helpers'
import { useRemixForm } from 'remix-hook-form'
import {
  emptyValues,
  GuruDaftarKelasDetailMataPelajaranDetailPenilaianFormType,
  resolver,
  translateRawToFormData,
} from './form'
import { useEffect } from 'react'
import { ActionDataGuruDaftarKelasDetailMataPelajaranDetailPenilaian } from '~/types/actions-data/guru'
import toast from 'react-hot-toast'
import { Button } from '~/components/forms'
import { FaSave } from 'react-icons/fa'

const sectionPrefix = 'guru-daftar-kelas-detail-mata-pelajaran-detail-penilaian'

export default function GuruDaftarKelasDetailMataPelajaranDetailPenilaianPage() {
  const params = useParams()
  const loader = useLoaderData<LoaderDataGuruDaftarKelasDetailMataPelajaranDetailPenilaian>()
  const actionData = useActionData<ActionDataGuruDaftarKelasDetailMataPelajaranDetailPenilaian>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher({ key: `${sectionPrefix}-form` })

  const formHook = useRemixForm<GuruDaftarKelasDetailMataPelajaranDetailPenilaianFormType>({
    defaultValues: emptyValues,
    mode: 'onChange',
    resolver,
  })

  const resetForm = () => {
    formHook.reset(translateRawToFormData(loader.penilaians))
  }

  useEffect(() => {
    if (loader && loader.penilaians) resetForm()
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
    kelasId,
    mataPelajaranId,
    kompetensiId,
    siswaId,
    nilai,
  }: {
    kelasId: string
    mataPelajaranId: string
    kompetensiId: string
    siswaId: string
    nilai: string
  }) {
    const penilaians = [...formHook.getValues('penilaians')]
    const existingIdx = penilaians.findIndex(
      item =>
        item.kelasId === kelasId &&
        item.mataPelajaranId === mataPelajaranId &&
        item.kompetensiId === kompetensiId &&
        item.siswaId === siswaId,
    )

    if (existingIdx >= 0) {
      // * Existing -> Updating
      const existing = penilaians[existingIdx]
      const newData: GuruDaftarKelasDetailMataPelajaranDetailPenilaianFormType['penilaians'][0] = {
        id: existing.id,
        kelasId: existing.kelasId,
        mataPelajaranId: mataPelajaranId,
        kompetensiId: existing.kompetensiId,
        siswaId: existing.siswaId,
        nilai: Number(nilai),
      }
      const newPenilaians = [...penilaians.filter((_, index) => index !== existingIdx), newData]
      formHook.setValue('penilaians', newPenilaians)
      formHook.trigger('penilaians')
    } else {
      // * Not Existing -> Inserting
      const newData: GuruDaftarKelasDetailMataPelajaranDetailPenilaianFormType['penilaians'][0] = {
        id: null,
        kelasId: kelasId,
        mataPelajaranId: mataPelajaranId,
        kompetensiId: kompetensiId,
        siswaId: siswaId,
        nilai: Number(nilai),
      }
      const newPenilaians = [...penilaians, newData]
      formHook.setValue('penilaians', newPenilaians)
      formHook.trigger('penilaians')
    }
  }

  function getPenilaian({
    kelasId,
    mataPelajaranId,
    kompetensiId,
    siswaId,
  }: {
    kelasId: string
    mataPelajaranId: string
    kompetensiId: string
    siswaId: string
  }): GuruDaftarKelasDetailMataPelajaranDetailPenilaianFormType['penilaians'][0] | undefined {
    const penilaians = [...formHook.watch('penilaians')]
    const existing = penilaians.find(
      item =>
        item.kelasId === kelasId &&
        item.mataPelajaranId === mataPelajaranId &&
        item.kompetensiId === kompetensiId &&
        item.siswaId === siswaId,
    )
    return existing
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <Card className='!p-0 mt-4 lg:mt-8'>
      <GuruManageMataPelajaranDetailTab
        kelas={loader.kelas}
        mataPelajaran={loader.mataPelajaran}
        activeTabKey={TabKey.PENILAIAN}
      />

      <fetcher.Form method='post' onSubmit={formHook.handleSubmit}>
        <div className='w-full max-w-full overflow-x-auto pb-4 max-h-[400px]'>
          <table className='border-collapse border'>
            <thead className='bg-white'>
              <tr>
                <th className='w-64 min-w-64 sticky top-0 z-20 bg-white border'></th>
                {loader.kompetensis.map(kompetensi => (
                  <th key={kompetensi.id} className='sticky top-0 z-20 bg-white border p-2'>
                    {kompetensi.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loader.siswaPerKelasPerSemesters.map(item => (
                <tr key={item.id}>
                  <td className='sticky left-0 bg-white z-10 border p-2'>
                    {item.siswa ? DBHelpers.akun.getDisplayName(item.siswa) : '-'}
                  </td>
                  {loader.kompetensis.map(kompetensi => {
                    const containerKey = `${item.id}-${kompetensi.id}`
                    const currPenilaian = getPenilaian({
                      kelasId: params.kelasId ?? '',
                      mataPelajaranId: params.mataPelajaranId ?? '',
                      kompetensiId: kompetensi.id,
                      siswaId: item.siswaId,
                    })

                    return (
                      <td key={containerKey} className='border'>
                        <input
                          type='phone'
                          className='w-28 p-2 text-center'
                          min={0}
                          max={100}
                          value={currPenilaian ? String(Number(currPenilaian.nilai)) : ''}
                          onChange={e => {
                            let value = e.target.value
                            value = value.replace(/\D/g, '')
                            value = value.replace(/^0+(?=\d)/, '')

                            if (value === '') {
                              setPenilaian({
                                kelasId: params.kelasId ?? '',
                                mataPelajaranId: params.mataPelajaranId ?? '',
                                kompetensiId: kompetensi.id,
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
                              kelasId: params.kelasId ?? '',
                              mataPelajaranId: params.mataPelajaranId ?? '',
                              kompetensiId: kompetensi.id,
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
            label='Simpan'
            buttonProps={{ type: 'submit' }}
          />
        </div>
      </fetcher.Form>
    </Card>
  )
}
