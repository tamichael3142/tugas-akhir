import { Link, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react'
import { FaPlus } from 'react-icons/fa'
import { Button } from '~/components/forms'
import { DataGrid } from '~/components/ui'
import { Role } from '~/database/enums/prisma.enums'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { LoaderDataAdminMasterAkun } from '~/types/loaders-data/admin'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import * as dateFns from 'date-fns'
import constants from '~/constants'

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
        <Link key={`${sectionPrefix}-add-button`} to={AppNav.admin.masterAccountCreate()}>
          <Button label='Tambah' startIcon={<FaPlus />} onlyIconOnSmallView />
        </Link>,
      ]}
    >
      <DataGrid
        id={`${sectionPrefix}-data-grid`}
        columns={[
          // { field: 'checkbox', label: '', render: () => <input type='checkbox' /> },
          { field: 'username', label: 'Username' },
          { field: 'role', label: 'Role', render: row => EnumsTitleUtils.getRole(row.role as Role) },
          { field: 'firstName', label: 'Nama Depan' },
          { field: 'lastName', label: 'Nama Belakang' },
          { field: 'email', label: 'Email' },
          {
            field: 'createdAt',
            label: 'Created At',
            render: row => dateFns.format(row.createdAt, constants.dateFormats.dateColumn),
          },
          // {
          //   field: 'actions',
          //   label: 'Aksi',
          //   render: row => (
          //     <div>
          //       <button>
          //         <IoConstruct />
          //       </button>
          //       <button>
          //         <IoAccessibility />
          //       </button>
          //     </div>
          //   ),
          // },
        ]}
        rows={loader.akuns.data}
        pagination={{
          page: loader.akuns.pagination.page,
          pageSize: loader.akuns.pagination.limit,
          total: loader.akuns.pagination.total,
          totalPages: loader.akuns.pagination.totalPages,
          onPageChange: handlePageChange,
        }}
        className='shadow-primary'
      />
    </AdminPageContainer>
  )
}
