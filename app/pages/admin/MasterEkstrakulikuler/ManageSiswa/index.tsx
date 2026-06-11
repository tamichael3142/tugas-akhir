import { useFetcher, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { ReactNode, useEffect, useState } from 'react'
import { Button, Checkbox, TextInput } from '~/components/forms'
import { BackButton, Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { ActionDataAdminMasterEkstrakulikulerDeleteSiswa } from '~/types/actions-data/admin'
import toast from 'react-hot-toast'
import { LoaderDataAdminMasterEkstrakulikulerManageSiswa } from '~/types/loaders-data/admin'
import { SiswaPerEkstrakulikuler } from '@prisma/client'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import { IoMdClose } from 'react-icons/io'
import DBHelpers from '~/database/helpers'
import { IoAdd } from 'react-icons/io5'
import { FaTrash } from 'react-icons/fa'
import { useRemixForm } from 'remix-hook-form'
import { emptyValues, resolver } from './form'

const sectionPrefix = 'admin-master-ekstrakulikuler-manage-siswa'
const deleteFormId = `${sectionPrefix}-delete-form`

export default function AdminMasterEkstrakulikulerManageSiswaPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataAdminMasterEkstrakulikulerManageSiswa>()
  const revalidator = useRevalidator()
  const fetcher = useFetcher<ActionDataAdminMasterEkstrakulikulerDeleteSiswa>({ key: deleteFormId })

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

  const formHook = useRemixForm({
    defaultValues: emptyValues,
    resolver: resolver,
  })

  const selectedIds = formHook.watch('siswaPerEkstrakulikulerIds')

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message ?? '')
      revalidator.revalidate()
      formHook.reset({ siswaPerEkstrakulikulerIds: [] })
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.message ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data])

  function handlePageChange({ newPage }: { newPage: number }) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
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
    return <div className='col-span-2 md:col-span-1'>{children}</div>
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <AdminPageContainer
      title='Manage Student'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} to={AppNav.admin.masterEkstrakulikuler()} />]}
    >
      <Card className='mb-8 shadow-lg'>
        <div className='grid grid-cols-2 gap-4'>
          <FilterGridItem>
            <TextInput
              label='Extracurricular - Teacher'
              inputProps={{
                value: `${loader.ekstrakulikuler?.nama}${loader.ekstrakulikuler?.pengajar ? ` - ${DBHelpers.akun.getDisplayName(loader.ekstrakulikuler?.pengajar)}` : ''}`,
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
          <div className='flex flex-col sm:flex-row items-center gap-4 mb-4 lg:mb-8'>
            <TextInput
              className='max-w-xs'
              inputProps={{
                placeholder: 'Search student...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
            <div className='grow'></div>
            <fetcher.Form id={deleteFormId} method='delete' onSubmit={formHook.handleSubmit}>
              <Button
                key={`${sectionPrefix}-delete-siswa-button`}
                label='Remove Student'
                color='danger'
                startIcon={<FaTrash />}
                buttonProps={{ disabled: selectedIds.length === 0, type: 'submit', form: deleteFormId }}
              />
            </fetcher.Form>
            <Button
              key={`${sectionPrefix}-add-siswa-button`}
              color='secondary'
              label='Add Student'
              startIcon={<IoAdd />}
              buttonProps={{
                onClick: () => {
                  navigate(AppNav.admin.masterEkstrakulikulerAddSiswa({ id: loader.ekstrakulikuler?.id ?? '' }))
                },
              }}
              className='w-full md:w-44'
            />
          </div>
        }
        columns={[
          {
            field: 'checkbox',
            label: (
              <div className='flex items-center justify-center'>
                <DataGridActionButton
                  icon={<IoMdClose />}
                  buttonProps={{
                    disabled: selectedIds.length <= 0,
                    onClick: () => formHook.reset({ siswaPerEkstrakulikulerIds: [] }),
                  }}
                />
              </div>
            ),
            render: row => (
              <div className='flex items-center justify-center'>
                <Checkbox
                  inputProps={{
                    checked: selectedIds.includes(row.id),
                    onChange: e => {
                      const oldValues = formHook.getValues('siswaPerEkstrakulikulerIds')
                      let newValues: SiswaPerEkstrakulikuler['id'][] = []
                      if (e.target.checked && !oldValues.includes(row.id)) newValues = [...oldValues, row.id]
                      else newValues = oldValues.filter(item => item !== row.id)

                      formHook.setValue('siswaPerEkstrakulikulerIds', newValues)
                    },
                  }}
                />
              </div>
            ),
          },
          { field: 'username', label: 'Username', render: row => row.siswa?.username },
          { field: 'firstName', label: 'First Name', render: row => row.siswa?.firstName },
          { field: 'lastName', label: 'Last Name', render: row => row.siswa?.lastName },
          { field: 'email', label: 'Email', render: row => row.siswa?.email },
        ]}
        rows={loader.siswaPerEkstrakulikulers.data}
        pagination={{
          page: loader.siswaPerEkstrakulikulers.pagination.page,
          pageSize: loader.siswaPerEkstrakulikulers.pagination.limit,
          total: loader.siswaPerEkstrakulikulers.pagination.total,
          totalPages: loader.siswaPerEkstrakulikulers.pagination.totalPages,
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='shadow-primary'
      />
    </AdminPageContainer>
  )
}
