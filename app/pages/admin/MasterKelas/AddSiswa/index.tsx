import {
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigate,
  useRevalidator,
  useSearchParams,
} from '@remix-run/react'
import { ReactNode, useEffect, useState } from 'react'
import { useRemixForm } from 'remix-hook-form'
import { Button, Checkbox, TextInput } from '~/components/forms'
import { BackButton, Card, DataGrid } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import { ActionDataAdminMasterKelasManageJadwal } from '~/types/actions-data/admin'
import toast from 'react-hot-toast'
import { LoaderDataAdminMasterKelasAddSiswa } from '~/types/loaders-data/admin'
import { FaSave } from 'react-icons/fa'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import { AdminMasterKelasAddSiswaFormType, emptyValues, resolver } from './form'

const sectionPrefix = 'admin-master-kelas-add-siswa'
const formId = `${sectionPrefix}-form`

export default function AdminMasterKelasAddSiswaPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataAdminMasterKelasAddSiswa>()
  const actionData = useActionData<ActionDataAdminMasterKelasManageJadwal>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher({ key: formId })

  const formHook = useRemixForm<AdminMasterKelasAddSiswaFormType>({
    defaultValues: emptyValues,
    mode: 'onChange',
    resolver,
  })

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')
  const isLoading = revalidator.state === 'loading' || fetcher.state === 'submitting'

  useEffect(() => {
    const sem1 = loader.siswaPerKelasPerSemesters
      .filter(item => item.semesterAjaran?.urutan === SemesterAjaranUrutan.SATU)
      .map(item => item.siswaId)
    const sem2 = loader.siswaPerKelasPerSemesters
      .filter(item => item.semesterAjaran?.urutan === SemesterAjaranUrutan.DUA)
      .map(item => item.siswaId)
    formHook.reset({
      kelasId: loader.kelas?.id ?? '',
      semester1Ids: sem1,
      semester2Ids: sem2,
    })
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

  function handlePageChange({ newPage, semesterAjaranId }: { newPage: number; semesterAjaranId?: string }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    if (semesterAjaranId) params.set('semesterAjaranId', semesterAjaranId)
    else params.delete('semesterAjaranId')
    navigate(`?${params.toString()}`, { replace: false })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (searchText) params.set('search', searchText)
      else params.delete('search')
      params.set('page', '1')
      navigate(`?${params.toString()}`, { replace: false })
    }, 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  function FilterGridItem({ children }: { children?: ReactNode }) {
    return <div className='col-span-3 md:col-span-1'>{children}</div>
  }

  return (
    <AdminPageContainer
      title='Tambah Siswa'
      actions={[
        <Button
          key={`${formId}-submit-button`}
          variant='contained'
          color='secondary'
          startIcon={<FaSave />}
          label='Simpan'
          buttonProps={{ type: 'submit', form: formId, disabled: isLoading }}
        />,
        <BackButton key={`${sectionPrefix}-back-button`} />,
      ]}
    >
      <fetcher.Form id={formId} method='post' onSubmit={formHook.handleSubmit}>
        <Card className='mb-8 shadow-lg'>
          <div className='grid grid-cols-3 gap-4'>
            <FilterGridItem>
              <TextInput
                label='Kelas'
                inputProps={{
                  value: loader.kelas?.nama,
                  readOnly: true,
                }}
              />
            </FilterGridItem>
            <FilterGridItem>
              <TextInput
                label='Tahun Ajaran'
                inputProps={{
                  value: loader.kelas?.tahunAjaran.nama,
                  readOnly: true,
                }}
              />
            </FilterGridItem>
          </div>
        </Card>

        <DataGrid
          id={`${sectionPrefix}-data-grid`}
          leadingView={
            <div className='mb-2'>
              <TextInput
                className='max-w-xs'
                inputProps={{
                  placeholder: 'Cari siswa...',
                  value: searchText,
                  onChange: e => setSearchText(e.target.value),
                }}
              />
            </div>
          }
          columns={[
            {
              field: 'checkbox',
              label: (
                <div className='flex items-center justify-center'>
                  <p>Include Siswa</p>
                  {/* <DataGridActionButton
                    icon={<IoMdClose />}
                    buttonProps={{
                      disabled:
                        formHook.watch('semester1Ids').length <= 0 && formHook.watch('semester2Ids').length <= 0,
                      onClick: () => {
                        formHook.setValue('semester1Ids', [])
                        formHook.setValue('semester2Ids', [])
                        formHook.trigger(['semester1Ids', 'semester2Ids'])
                      },
                    }}
                  /> */}
                </div>
              ),
              render: row => {
                const sem1 = formHook.watch('semester1Ids')
                const sem2 = formHook.watch('semester2Ids')
                return (
                  <div className='flex items-center justify-center gap-2'>
                    <Checkbox
                      label='All'
                      labelPosition='right'
                      inputProps={{
                        id: `${sectionPrefix}-cb-all-${row.id}`,
                        checked: sem1.includes(row.id) && sem2.includes(row.id),
                        onChange: e => {
                          const s1 = [...formHook.getValues('semester1Ids')]
                          const s2 = [...formHook.getValues('semester2Ids')]
                          if (e.target.checked) {
                            const ns1 = s1.includes(row.id) ? s1 : [...s1, row.id]
                            const ns2 = s2.includes(row.id) ? s2 : [...s2, row.id]
                            formHook.setValue('semester1Ids', ns1)
                            formHook.setValue('semester2Ids', ns2)
                          } else {
                            formHook.setValue(
                              'semester1Ids',
                              s1.filter(item => item !== row.id),
                            )
                            formHook.setValue(
                              'semester2Ids',
                              s2.filter(item => item !== row.id),
                            )
                          }
                          formHook.trigger(['semester1Ids', 'semester2Ids'])
                        },
                      }}
                    />
                    <Checkbox
                      label='Sem 1'
                      labelPosition='right'
                      inputProps={{
                        id: `${sectionPrefix}-cb-sem1-${row.id}`,
                        checked: sem1.includes(row.id),
                        onChange: e => {
                          const s1 = [...formHook.getValues('semester1Ids')]
                          if (e.target.checked && !s1.includes(row.id))
                            formHook.setValue('semester1Ids', [...s1, row.id])
                          else
                            formHook.setValue(
                              'semester1Ids',
                              s1.filter(item => item !== row.id),
                            )
                          formHook.trigger('semester1Ids')
                        },
                      }}
                    />
                    <Checkbox
                      label='Sem 2'
                      labelPosition='right'
                      inputProps={{
                        id: `${sectionPrefix}-cb-sem2-${row.id}`,
                        checked: sem2.includes(row.id),
                        onChange: e => {
                          const s2 = [...formHook.getValues('semester2Ids')]
                          if (e.target.checked && !s2.includes(row.id))
                            formHook.setValue('semester2Ids', [...s2, row.id])
                          else
                            formHook.setValue(
                              'semester2Ids',
                              s2.filter(item => item !== row.id),
                            )
                          formHook.trigger('semester2Ids')
                        },
                      }}
                    />
                  </div>
                )
              },
            },
            { field: 'username', label: 'Username', render: row => row?.username },
            { field: 'firstName', label: 'Nama Depan', render: row => row?.firstName },
            { field: 'lastName', label: 'Nama Belakang', render: row => row?.lastName },
            { field: 'email', label: 'Email', render: row => row?.email },
          ]}
          rows={loader.availableSiswas.data}
          pagination={{
            page: loader.availableSiswas.pagination.page,
            pageSize: loader.availableSiswas.pagination.limit,
            total: loader.availableSiswas.pagination.total,
            totalPages: loader.availableSiswas.pagination.totalPages,
            onPageChange: newPage => handlePageChange({ newPage }),
          }}
          className='shadow-primary'
        />
      </fetcher.Form>
    </AdminPageContainer>
  )
}
