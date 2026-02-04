import { useActionData, useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Button, Checkbox, StaticSelect, TextInput } from '~/components/forms'
import { BackButton, Card, DataGrid, LoadingFullScreen } from '~/components/ui'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { ActionDataAdminMasterKelasManageJadwal } from '~/types/actions-data/admin'
import toast from 'react-hot-toast'
import { LoaderDataAdminMasterKelasManageSiswa } from '~/types/loaders-data/admin'
import { Akun } from '@prisma/client'
import DataGridActionButton from '~/components/ui/DataGrid/ActionButton'
import { IoMdClose } from 'react-icons/io'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import DBHelpers from '~/database/helpers'
import { IoAdd } from 'react-icons/io5'

const sectionPrefix = 'admin-master-kelas-manage-siswa'

export default function AdminMasterKelasManageSiswaPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loader = useLoaderData<LoaderDataAdminMasterKelasManageSiswa>()
  const actionData = useActionData<ActionDataAdminMasterKelasManageJadwal>()
  const revalidator = useRevalidator()

  const [selectedIds, setSelectedIds] = useState<Akun['id'][]>([])
  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

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
    if (
      loader &&
      loader.kelas?.tahunAjaran &&
      loader.kelas.tahunAjaran.semesterAjaran &&
      !searchParams.has('semesterAjaranId')
    ) {
      const currentSemester = loader.kelas.tahunAjaran.semesterAjaran.find(
        item => item.urutan === SemesterAjaranUrutan.SATU,
      )
      if (currentSemester) {
        handlePageChange({ newPage: 1, semesterAjaranId: currentSemester.id })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader])

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

  const getSemesterAjaranOptions = useCallback(() => {
    if (loader.kelas?.tahunAjaran && loader.kelas.tahunAjaran.semesterAjaran)
      return loader.kelas.tahunAjaran.semesterAjaran
    else return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader.kelas?.tahunAjaran])

  function FilterGridItem({ children }: { children?: ReactNode }) {
    return <div className='col-span-3 md:col-span-1'>{children}</div>
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <AdminPageContainer
      title='Manage Siswa'
      actions={[<BackButton key={`${sectionPrefix}-back-button`} to={AppNav.admin.masterKelas()} />]}
    >
      <Card className='mb-8 shadow-lg'>
        <div className='grid grid-cols-3 gap-4'>
          <FilterGridItem>
            <TextInput
              label='Kelas - Wali'
              inputProps={{
                value: `${loader.kelas?.nama}${loader.kelas?.wali ? ` - ${DBHelpers.akun.getDisplayName(loader.kelas?.wali)}` : ''}`,
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <TextInput
              label='Tahun Ajaran'
              inputProps={{
                value: loader.kelas?.tahunAjaran.nama,
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <StaticSelect
              label='Semester Ajaran'
              options={[
                ...getSemesterAjaranOptions().map(item => ({
                  value: item.id,
                  label: EnumsTitleUtils.getSemesterAjaranUrutan(item.urutan as SemesterAjaranUrutan),
                })),
              ]}
              selectProps={{
                value: searchParams.get('semesterAjaranId') ?? '',
                onChange: newValue => {
                  handlePageChange({
                    newPage: loader.siswaPerKelasPerSemesters.pagination.page,
                    semesterAjaranId: newValue.target.value,
                  })
                },
              }}
            />
          </FilterGridItem>
        </div>
      </Card>

      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        leadingView={
          <div className='flex flex-col sm:flex-row items-center gap-4'>
            <TextInput
              className='max-w-xs'
              inputProps={{
                placeholder: 'Cari siswa...',
                value: searchText,
                onChange: e => setSearchText(e.target.value),
              }}
            />
            <div className='grow'></div>
            <Button
              key={`${sectionPrefix}-add-button`}
              color='secondary'
              label='Tambah Siswa'
              startIcon={<IoAdd />}
              buttonProps={{
                onClick: () => {
                  navigate(
                    AppNav.admin.masterKelasAddSiswa({
                      id: loader.kelas?.id ?? '',
                    }),
                  )
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
                  buttonProps={{ disabled: selectedIds.length <= 0, onClick: () => setSelectedIds([]) }}
                />
              </div>
            ),
            render: row => (
              <div className='flex items-center justify-center'>
                <Checkbox
                  inputProps={{
                    checked: selectedIds.includes(row.siswaId),
                    onChange: e =>
                      setSelectedIds(oldValues => {
                        let newValues: Akun['id'][] = []
                        if (e.target.checked && !oldValues.includes(row.siswaId))
                          newValues = [...oldValues, row.siswaId]
                        else newValues = oldValues.filter(item => item !== row.siswaId)

                        return newValues
                      }),
                  }}
                />
              </div>
            ),
          },
          { field: 'username', label: 'Username', render: row => row.siswa?.username },
          // { field: 'role', label: 'Role', render: row => EnumsTitleUtils.getRole(row.siswa?.role as Role) },
          { field: 'firstName', label: 'Nama Depan', render: row => row.siswa?.firstName },
          { field: 'lastName', label: 'Nama Belakang', render: row => row.siswa?.lastName },
          { field: 'email', label: 'Email', render: row => row.siswa?.email },
          // {
          //   field: 'createdAt',
          //   label: 'Created At',
          //   render: row =>
          //     row.siswa?.createdAt ? dateFns.format(row.siswa.createdAt, constants.dateFormats.dateColumn) : '-',
          // },
          // {
          //   field: 'updatedAt',
          //   label: 'Updated At',
          //   render: row =>
          //     row.siswa?.updatedAt ? dateFns.format(row.siswa.updatedAt, constants.dateFormats.dateColumn) : '-',
          // },
          // {
          //   field: 'deletedAt',
          //   label: 'Deleted At',
          //   render: row =>
          //     row.siswa?.deletedAt ? dateFns.format(row.siswa.deletedAt, constants.dateFormats.dateColumn) : '-',
          // },
        ]}
        rows={loader.siswaPerKelasPerSemesters.data}
        pagination={{
          page: loader.siswaPerKelasPerSemesters.pagination.page,
          pageSize: loader.siswaPerKelasPerSemesters.pagination.limit,
          total: loader.siswaPerKelasPerSemesters.pagination.total,
          totalPages: loader.siswaPerKelasPerSemesters.pagination.totalPages,
          onPageChange: newPage => handlePageChange({ newPage }),
        }}
        className='shadow-primary'
      />
    </AdminPageContainer>
  )
}
