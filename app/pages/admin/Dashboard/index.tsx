import { useRemixForm } from 'remix-hook-form'
import { getDummyUserValue, emptyUserValue, FormType, resolver } from './form'
import { Form } from '@remix-run/react'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import { Button } from '~/components/forms'
import { FaSave, FaTrash } from 'react-icons/fa'
import { $Enums } from '@prisma/client'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { useRef } from 'react'

const formId = 'admin-bulk-insert-user-form'
const importExcelFormId = 'admin-import-excel-user-form'
const tableSectionId = 'admin-bulk-insert-user-table'

const headers: { label: string }[] = [
  { label: 'Nama Lengkap' },
  { label: 'Tempat Lahir' },
  { label: 'Tanggal Lahir' },
  { label: 'Role' },
  { label: 'Username' },
  { label: 'Password' },
  { label: 'Email' },
  { label: 'Jenis Kelamin' },
  { label: 'Agama' },
  { label: 'Alamat' },
  { label: 'Gol Darah' },
  { label: 'Kewarganegaraan' },
]

export default function AdminDashboardPage() {
  const importExcelFormRef = useRef<HTMLFormElement>(null)
  const importExcelInputRef = useRef<HTMLInputElement>(null)

  const formHook = useRemixForm<FormType>({
    defaultValues: {
      newUsers: [],
    },
    mode: 'all',
    resolver,
  })
  const arrayField = formHook.watch('newUsers')

  return (
    <AdminPageContainer
      title='Dashboard'
      actions={[
        <Button
          key={importExcelFormId}
          label='Import Excel'
          color='secondary'
          buttonProps={{ onClick: () => importExcelInputRef.current?.click() }}
        />,
        <Button
          key={formId}
          label='Simpan'
          startIcon={<FaSave />}
          onlyIconOnSmallView
          buttonProps={{ type: 'submit', form: formId }}
        />,
      ]}
    >
      <Form
        id={importExcelFormId}
        method='post'
        action='/action/admin/import-excel-user'
        ref={importExcelFormRef}
        encType='multipart/form-data'
      >
        <input
          type='file'
          name='file'
          hidden
          ref={importExcelInputRef}
          accept='.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          onChange={() => importExcelFormRef.current?.submit()}
        />
      </Form>
      <Form id={formId} method='post' onSubmit={formHook.handleSubmit}>
        <div className='max-w-full max-h-[70vh] overflow-x-auto border-2 rounded-lg relative'>
          <table className='w-full bg-white'>
            <thead className='sticky top-0 bg-white'>
              <tr>
                {headers.map((hdr, index) => (
                  <th key={`${tableSectionId}-header-${index}`} className='border'>
                    {hdr.label}
                  </th>
                ))}
                <th className='border min-w-20'>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {arrayField.map((_, index) => (
                <tr key={`${tableSectionId}-row-${index}`}>
                  <td className='border'>
                    <input hidden {...formHook.register(`newUsers.${index}.tempAkunId`)} />
                    <input required {...formHook.register(`newUsers.${index}.displayName`)} />
                  </td>
                  <td className='border'>
                    <input {...formHook.register(`newUsers.${index}.tempatLahir`)} />
                  </td>
                  <td className='border'>
                    <input type='date' {...formHook.register(`newUsers.${index}.tanggalLahir`)} />
                  </td>
                  <td className='border'>
                    <select {...formHook.register(`newUsers.${index}.role`)}>
                      {Object.values($Enums.Role).map((opt, index) => (
                        <option key={index} value={opt}>
                          {EnumsTitleUtils.getRole(opt)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='border'>
                    <input required {...formHook.register(`newUsers.${index}.username`)} />
                  </td>
                  <td className='border'>
                    <input required {...formHook.register(`newUsers.${index}.password`)} />
                  </td>
                  <td className='border'>
                    <input type='email' {...formHook.register(`newUsers.${index}.email`)} />
                  </td>
                  <td className='border'>
                    <select {...formHook.register(`newUsers.${index}.gender`)}>
                      {Object.values($Enums.JenisKelamin).map((opt, index) => (
                        <option key={index} value={opt}>
                          {EnumsTitleUtils.getJenisKelamin(opt)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='border'>
                    <input {...formHook.register(`newUsers.${index}.agama`)} />
                  </td>
                  <td className='border'>
                    <input {...formHook.register(`newUsers.${index}.alamat`)} />
                  </td>
                  <td className='border'>
                    <select {...formHook.register(`newUsers.${index}.golDarah`)}>
                      {Object.values($Enums.GolonganDarah).map((opt, index) => (
                        <option key={index} value={opt}>
                          {EnumsTitleUtils.getGolonganDarah(opt)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='border'>
                    <select {...formHook.register(`newUsers.${index}.kewarganegaraan`)}>
                      {Object.values($Enums.Kewarganegaraan).map((opt, index) => (
                        <option key={index} value={opt}>
                          {EnumsTitleUtils.getKewarganegaraan(opt)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='border'>
                    <div className='flex fle-row items-center justify-center'>
                      <button
                        type='button'
                        className='cursor-pointer disabled:cursor-not-allowed text-red-500 disabled:text-gray-500'
                        onClick={() => {
                          formHook.setValue(
                            'newUsers',
                            [...arrayField].filter((_, idx) => idx !== index),
                          )
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Form>
      <Button
        label='Tambah'
        className='w-full mt-4'
        buttonProps={{
          onClick: () =>
            formHook.setValue('newUsers', [
              ...arrayField,
              process.env.NODE_ENV === 'development' ? getDummyUserValue() : emptyUserValue,
            ]),
        }}
      />
    </AdminPageContainer>
  )
}
