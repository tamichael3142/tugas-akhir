import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react'
import { FaPlus } from 'react-icons/fa'
import { Button } from '~/components/forms'
import DataGrid from '~/components/ui/DataGrid'
import { Role } from '~/enums/prisma.enums'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import { LoaderDataAdminMasterAkun } from '~/types/loaders-data/admin'
import EnumsTitleUtils from '~/utils/enums-title.utils'

const sectionPrefix = 'admin-master-account'

export default function AdminMasterAccountPage() {
  const loader = useLoaderData<LoaderDataAdminMasterAkun>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    navigate(`?${params.toString()}`, { replace: false })
  }

  return (
    <AdminPageContainer
      title='Master Account'
      actions={[
        <Button key={`${sectionPrefix}-add-button`} label='Tambah' startIcon={<FaPlus />} onlyIconOnSmallView />,
      ]}
    >
      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        columns={[
          { field: 'checkbox', label: '', render: () => <input type='checkbox' /> },
          { field: 'displayName', label: 'Nama' },
          { field: 'email', label: 'Email' },
          { field: 'username', label: 'Username' },
          { field: 'role', label: 'Role', render: row => EnumsTitleUtils.getRole(row.role as Role) },
          { field: 'createdAt', label: 'Created At', render: row => row.createdAt.toISOString() },
        ]}
        rows={loader.akuns.data}
        pagination={{
          page: loader.akuns.pagination.page,
          pageSize: loader.akuns.pagination.limit,
          total: loader.akuns.pagination.total,
          totalPages: loader.akuns.pagination.totalPages,
          onPageChange: handlePageChange,
        }}
      />
      {/* <div>
        {loader.akuns.data?.map((akun, index) => (
          <Fragment key={`${sectionPrefix}-akun-${index}`}>
            <p>{akun.displayName}</p>
            <br />
          </Fragment>
        ))}
      </div> */}
    </AdminPageContainer>
  )
}
