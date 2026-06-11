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
import toast from 'react-hot-toast'
import { FaSave } from 'react-icons/fa'
import { Button, Checkbox, TextInput } from '~/components/forms'
import { BackButton, Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { ActionDataAdminMasterEkstrakulikulerAddSiswa } from '~/types/actions-data/admin'
import { LoaderDataAdminMasterEkstrakulikulerAddSiswa } from '~/types/loaders-data/admin'
import { AdminMasterEkstrakulikulerAddSiswaFormType, emptyValues, resolver } from './form'

const sectionPrefix = 'admin-master-ekstrakulikuler-add-siswa'
const formId = `${sectionPrefix}-form`

export default function AdminMasterEkstrakulikulerAddSiswaPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataAdminMasterEkstrakulikulerAddSiswa>()
  const actionData = useActionData<ActionDataAdminMasterEkstrakulikulerAddSiswa>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher({ key: formId })

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')
  const isLoading = revalidator.state === 'loading' || fetcher.state === 'submitting'

  const formHook = useRemixForm<AdminMasterEkstrakulikulerAddSiswaFormType>({
    defaultValues: emptyValues,
    mode: 'onChange',
    resolver,
  })

  function handlePageChange({ newPage }: { newPage: number }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    navigate(`?${params.toString()}`, { replace: false })
  }

  useEffect(() => {
    formHook.reset({
      ekstrakulikulerId: loader.ekstrakulikuler?.id ?? '',
      siswaIds: loader.existingSiswaPerEkstrakulikulers.map(item => item.siswaId),
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
    return <div className='col-span-2 md:col-span-1'>{children}</div>
  }

  const siswaIds = formHook.watch('siswaIds')

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <AdminPageContainer
      title='Add Student'
      actions={[
        <Button
          key={`${formId}-submit-button`}
          variant='contained'
          color='secondary'
          startIcon={<FaSave />}
          label='Save'
          buttonProps={{ type: 'submit', form: formId, disabled: isLoading }}
        />,
        <BackButton
          key={`${sectionPrefix}-back-button`}
          to={AppNav.admin.masterEkstrakulikulerManageSiswa({ id: loader.ekstrakulikuler?.id ?? '' })}
        />,
      ]}
    >
      <fetcher.Form id={formId} method='post' onSubmit={formHook.handleSubmit}>
        <Card className='mb-8 shadow-lg'>
          <div className='grid grid-cols-2 gap-4'>
            <FilterGridItem>
              <TextInput
                label='Extracurricular'
                inputProps={{
                  value: loader.ekstrakulikuler?.nama,
                  readOnly: true,
                }}
              />
            </FilterGridItem>
            <FilterGridItem>
              <TextInput
                label='Academic Year'
                inputProps={{
                  value: loader.ekstrakulikuler?.tahunAjaran.nama,
                  readOnly: true,
                }}
              />
            </FilterGridItem>
          </div>
        </Card>

        <DataGrid
          id={`${sectionPrefix}-data-grid`}
          leadingView={
            <div className='mb-2 flex flex-row items-center gap-4 flex-wrap'>
              <TextInput
                className='max-w-xs'
                inputProps={{
                  placeholder: 'Search student...',
                  value: searchText,
                  onChange: e => setSearchText(e.target.value),
                }}
              />
            </div>
          }
          columns={[
            {
              field: 'checkbox',
              label: 'Include Siswa',
              render: row => (
                <div className='flex items-center justify-center'>
                  <Checkbox
                    inputProps={{
                      checked: siswaIds.includes(row.id),
                      onChange: e => {
                        const oldValues = formHook.getValues('siswaIds')
                        let newValues: string[] = []
                        if (e.target.checked && !oldValues.includes(row.id)) newValues = [...oldValues, row.id]
                        else newValues = oldValues.filter(item => item !== row.id)

                        formHook.setValue('siswaIds', newValues)
                      },
                    }}
                  />
                </div>
              ),
            },
            { field: 'username', label: 'Username', render: row => row?.username },
            { field: 'firstName', label: 'First Name', render: row => row?.firstName },
            { field: 'lastName', label: 'Last Name', render: row => row?.lastName },
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
