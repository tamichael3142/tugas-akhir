import { useRemixForm } from 'remix-hook-form'
import { emptyUserValue, FormType, resolver } from './form'
import { Form } from '@remix-run/react'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import { Button } from '~/components/forms'
import { FaSave, FaTrash } from 'react-icons/fa'
import { $Enums } from '@prisma/client'
import EnumsTitleUtils from '~/utils/enums-title.utils'

const formId = 'andasd'

export default function AdminDashboardPage() {
  const formHook = useRemixForm<FormType>({
    defaultValues: {
      newUsers: [emptyUserValue],
    },
    mode: 'all',
    resolver,
  })
  const arrayField = formHook.watch('newUsers')

  return (
    <AdminPageContainer
      title='Dashboard'
      actions={[
        <Button key={'import-excel'} label='Import Excel' color='secondary' />,
        <Button
          key={formId}
          label='Simpan'
          startIcon={<FaSave />}
          onlyIconOnSmallView
          buttonProps={{ type: 'submit', form: formId }}
        />,
      ]}
    >
      <Form id={formId} method='post' onSubmit={formHook.handleSubmit}>
        <div className='max-w-full max-h-[70vh] overflow-x-auto border-2 rounded-lg relative'>
          <table className='w-full bg-white'>
            <thead className='sticky top-0 bg-white'>
              <tr>
                <th className='border'>Nama Lengkap</th>
                <th className='border'>Tempat Lahir</th>
                <th className='border'>Tanggal Lahir</th>
                <th className='border'>Role</th>
                <th className='border'>Username</th>
                <th className='border'>Password</th>
                <th className='border'>Email</th>
                <th className='border'>Jenis Kelamin</th>
                <th className='border'>Agama</th>
                <th className='border'>Alamat</th>
                <th className='border'>Gol Darah</th>
                <th className='border'>Kewarganegaraan</th>
                <th className='border min-w-20'>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {arrayField.map((_, index) => (
                <tr key={`admin-bulk-insert-user-table-row-${index}`}>
                  <td className='border'>
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
        buttonProps={{ onClick: () => formHook.setValue('newUsers', [...arrayField, emptyUserValue]) }}
      />
    </AdminPageContainer>
  )
}
