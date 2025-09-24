import { useRemixForm } from 'remix-hook-form'
import { getDummyUserValue, emptyUserValue, FormType, resolver, defaultValues } from './form'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import { Button } from '~/components/forms'
import { FaSave, FaTrash } from 'react-icons/fa'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { useEffect, useRef } from 'react'
import { GolonganDarah, JenisKelamin, Kewarganegaraan, Role } from '~/enums/prisma.enums'
import { LoaderDataAdminIndex } from '~/types/loaders-data/admin'
import * as dateFns from 'date-fns'
import constants from '~/constants'
import AppNav from '~/navigation'
import { ActionDataAdminIndex } from '~/types/actions-data/admin'

const sectionPrefix = 'admin-bulk-insert'
const formId = `${sectionPrefix}-user-form`
const importExcelFormId = 'admin-import-excel-user-form'
const tableSectionId = `${sectionPrefix}-user-table`

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
  const loader = useLoaderData<LoaderDataAdminIndex>()
  const actionData = useActionData<ActionDataAdminIndex>()
  const createdAkuns = actionData?.success && !!actionData.data.createdAkuns ? actionData.data.createdAkuns : null

  const importExcelFormRef = useRef<HTMLFormElement>(null)
  const importExcelInputRef = useRef<HTMLInputElement>(null)

  const formHook = useRemixForm<FormType>({
    defaultValues,
    mode: 'all',
    resolver,
  })
  const arrayField = formHook.watch('newUsers')

  useEffect(() => {
    if (!!loader && !!loader.tempAkuns) {
      formHook.setValue(
        'newUsers',
        loader.tempAkuns.map(item => ({
          tempAkunId: item.id,
          displayName: item.displayName ?? '',
          tempatLahir: item.tempatLahir,
          tanggalLahir: item.tanggalLahir
            ? dateFns.format(item.tanggalLahir, constants.dateFormats.rawDateInput)
            : null,
          role: item.role as Role,
          username: item.username,
          password: item.password,
          email: item.email,
          jenisKelamin: item.jenisKelamin as JenisKelamin,
          agama: item.agama,
          alamat: item.alamat,
          golonganDarah: item.golonganDarah as GolonganDarah,
          kewarganegaraan: item.kewarganegaraan as Kewarganegaraan,
        })),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader, loader.tempAkuns])

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
        encType='multipart/form-data'
        action={AppNav.adminAction.importExcelUser()}
        ref={importExcelFormRef}
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
                      {Object.values(Role).map((opt, index) => (
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
                    <select {...formHook.register(`newUsers.${index}.jenisKelamin`)}>
                      {Object.values(JenisKelamin).map((opt, index) => (
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
                    <select {...formHook.register(`newUsers.${index}.golonganDarah`)}>
                      {Object.values(GolonganDarah).map((opt, index) => (
                        <option key={index} value={opt}>
                          {EnumsTitleUtils.getGolonganDarah(opt)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='border'>
                    <select {...formHook.register(`newUsers.${index}.kewarganegaraan`)}>
                      {Object.values(Kewarganegaraan).map((opt, index) => (
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
                          // ? Masukin ID yang mau dihapus dari db juga jika asalnya dari TempAkun
                          const prevDeletedTempAkunIds = formHook.getValues('deletedTempAkunIds')
                          const currId = formHook.getValues(`newUsers.${index}.tempAkunId`)
                          if (currId) formHook.setValue('deletedTempAkunIds', [...prevDeletedTempAkunIds, currId])

                          // ? Hapus row dari array
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

      {!!createdAkuns && createdAkuns.length ? (
        <div className='mt-4 p-4 bg-primary/10 rounded-xl'>
          <p className='font-semibold mb-4'>Akun yang berhasil dibuat:</p>
          <div className='grid grid-cols-4 gap-4'>
            {createdAkuns.map((akun, index) => (
              <div
                key={`${sectionPrefix}-createdAkun-${index}`}
                className='col-span-4 md:col-span-2 xl:col-span-1 bg-white rounded shadow-lg p-2'
              >
                <p className='text-lg font-medium'>{akun.displayName}</p>
                <p className='text-sm text-slate-500'>{akun.username}</p>
                <p className='text-sm'>
                  {`${EnumsTitleUtils.getJenisKelamin(akun.jenisKelamin as JenisKelamin)} - ${EnumsTitleUtils.getGolonganDarah(akun.golonganDarah as GolonganDarah)} - ${EnumsTitleUtils.getKewarganegaraan(akun.kewarganegaraan as Kewarganegaraan)}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </AdminPageContainer>
  )
}
