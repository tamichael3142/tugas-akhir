import {
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigate,
  useRevalidator,
  useSearchParams,
} from '@remix-run/react'
import { FaSave } from 'react-icons/fa'
import { Button, Checkbox, TextInput } from '~/components/forms'
import { BackButton, Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import { LoaderDataAdminMasterAkunManageChildren } from '~/types/loaders-data/admin'
import * as dateFns from 'date-fns'
import constants from '~/constants'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import { Akun } from '@prisma/client'
import { useEffect, useState } from 'react'
import { ActionDataAdminMasterAccountSaveChildren } from '~/types/actions-data/admin'
import { IoMdClose } from 'react-icons/io'
import { useRemixForm } from 'remix-hook-form'
import { AdminMasterAccountManageChildrenFormType, emptyValues, resolver, translateRawToFormData } from './form'
import toast from 'react-hot-toast'
import DBHelpers from '~/database/helpers'

const sectionPrefix = 'admin-master-account-manage-children'
const saveFormId = `${sectionPrefix}-save-form`

export default function AdminMasterAccountManageChildrenPage() {
  const loader = useLoaderData<LoaderDataAdminMasterAkunManageChildren>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const actionData = useActionData<ActionDataAdminMasterAccountSaveChildren>()
  const fetcher = useFetcher({ key: saveFormId })
  const revalidator = useRevalidator()

  const formHook = useRemixForm<AdminMasterAccountManageChildrenFormType>({
    defaultValues: emptyValues,
    resolver: resolver,
  })
  const selectedAkuns = formHook.watch('childrenIds')

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')
  const isLoading = revalidator.state === 'loading' || fetcher.state === 'submitting'

  useEffect(() => {
    formHook.reset(translateRawToFormData(loader.children))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader.children])

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
      handlePageChange({
        newPage: 1,
        search: searchText,
      })
    }, 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  function handlePageChange({ newPage, search }: { newPage: number; search: string }) {
    const params = new URLSearchParams(searchParams)
    if (search) params.set('search', search)
    else params.delete('search')
    params.set('page', String(newPage))
    navigate(`?${params.toString()}`, { replace: false })
  }

  function addOrRemove({ siswaId }: { siswaId: Akun['id'] }) {
    const oldValues = [...formHook.watch('childrenIds')]
    let newValues = []
    if (oldValues.includes(siswaId)) newValues = oldValues.filter(item => item !== siswaId)
    else newValues = [...oldValues, siswaId]

    formHook.setValue('childrenIds', newValues)
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <AdminPageContainer
      title='Manage Children'
      actions={[
        <Button
          key={`${sectionPrefix}-export-button`}
          label={'Simpan'}
          color='secondary'
          startIcon={<FaSave />}
          onlyIconOnSmallView
          buttonProps={{ type: 'submit', form: saveFormId, disabled: isLoading }}
        />,
        <BackButton key={`${sectionPrefix}-back-button`} />,
      ]}
    >
      <Card className='mb-8'>
        <h1 className='font-semibold font-lg mb-2'>Anak terdaftar:</h1>
        <div className='flex flex-row flex-wrap gap-2'>
          {loader.children.map(item => (
            <div key={`anak-terdaftar-${item.id}`} className='p-2 bg-neutral-200 rounded-lg border border-neutral-300'>
              {DBHelpers.akun.getDisplayName(item)} ({item.username})
            </div>
          ))}
        </div>
      </Card>

      <fetcher.Form id={saveFormId} method='post' onSubmit={formHook.handleSubmit}>
        <DataGrid
          id={`${sectionPrefix}-data-grid`}
          leadingView={
            <div className='mb-2 flex flex-row items-center gap-4 flex-wrap'>
              <TextInput
                className='max-w-xs'
                inputProps={{
                  placeholder: 'Cari siswa...',
                  value: searchText,
                  onChange: e => setSearchText(e.target.value),
                }}
              />
              <div className='grow'></div>
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
                      disabled: selectedAkuns.length <= 0,
                      onClick: () => formHook.setValue('childrenIds', []),
                    }}
                  />
                </div>
              ),
              render: row => {
                const existing = !!selectedAkuns.find(item => item === row.id)

                return (
                  <div className='flex items-center justify-center'>
                    <Checkbox
                      inputProps={{
                        checked: existing,
                        onChange: () => addOrRemove({ siswaId: row.id }),
                      }}
                    />
                  </div>
                )
              },
            },
            { field: 'username', label: 'Username' },
            { field: 'firstName', label: 'Nama Depan' },
            { field: 'lastName', label: 'Nama Belakang' },
            { field: 'email', label: 'Email' },
            {
              field: 'createdAt',
              label: 'Created At',
              render: row => dateFns.format(row.createdAt, constants.dateFormats.dateColumn),
            },
            {
              field: 'updatedAt',
              label: 'Updated At',
              render: row => dateFns.format(row.updatedAt, constants.dateFormats.dateColumn),
            },
            {
              field: 'deletedAt',
              label: 'Deleted At',
              render: row => (row.deletedAt ? dateFns.format(row.deletedAt, constants.dateFormats.dateColumn) : '-'),
            },
          ]}
          rows={loader.akuns.data}
          pagination={{
            page: loader.akuns.pagination.page,
            pageSize: loader.akuns.pagination.limit,
            total: loader.akuns.pagination.total,
            totalPages: loader.akuns.pagination.totalPages,
            onPageChange: page => handlePageChange({ newPage: page, search: searchText }),
          }}
          className='shadow-primary'
        />
      </fetcher.Form>
    </AdminPageContainer>
  )
}
