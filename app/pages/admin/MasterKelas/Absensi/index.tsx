import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import classNames from 'classnames'
import { format } from 'date-fns'
import { ReactNode, useState } from 'react'
import { FaPaperPlane, FaPrint } from 'react-icons/fa'
import { Button, TextInput } from '~/components/forms'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import constants from '~/constants'
import { TipeAbsensi } from '~/database/enums/prisma.enums'
import DBHelpers from '~/database/helpers'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import AppNav from '~/navigation'
import { LoaderDataAdminMasterKelasAbsensi } from '~/types/loaders-data/admin'
import EnumsTitleUtils from '~/utils/enums-title.utils'

const sectionPrefix = 'admin-master-kelas-absensi'

export default function AdminMasterKelasAbsensiPage() {
  const loader = useLoaderData<LoaderDataAdminMasterKelasAbsensi>()
  const revalidator = useRevalidator()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const startDateParams = (searchParams.get('startDate') ?? null) as string | null
  const endDateParams = (searchParams.get('endDate') ?? null) as string | null

  const notGeneratedYet = !startDateParams && !endDateParams

  const [startDate, setStartDate] = useState<string>(startDateParams ?? '')
  const [endDate, setEndDate] = useState<string>(endDateParams ?? '')

  function onGenerate() {
    if (startDate && endDate) {
      navigate(AppNav.admin.masterKelasAbsensi({ id: loader.kelas.id, startDate, endDate }))
    }
  }

  function FilterGridItem({ children, className }: { children?: ReactNode; className?: string }) {
    return <div className={classNames('col-span-3 md:col-span-1', className)}>{children}</div>
  }

  const absenDataExists = !notGeneratedYet && loader.absensis && loader.absensis.length > 0

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <AdminPageContainer
      key={sectionPrefix}
      title='Class Absence'
      actions={[
        <Button
          key={`${sectionPrefix}-print-button`}
          label='Print'
          color='secondary'
          startIcon={<FaPrint />}
          onlyIconOnSmallView
          buttonProps={{ onClick: () => window.print() }}
        />,
        <BackButton key={`${sectionPrefix}-back-button`} />,
      ]}
      className='pb-60'
    >
      <Card className='print:shadow-none print:p-4'>
        <div className='grid grid-cols-3 gap-4'>
          <FilterGridItem>
            <TextInput
              label='Class'
              labelClassName='print:text-[10px]'
              className='print:text-[10px]'
              inputProps={{
                value: loader.kelas?.nama,
                readOnly: true,
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <TextInput
              label='Academic Year'
              labelClassName='print:text-[10px]'
              className='print:text-[10px]'
              inputProps={{
                value: loader.kelas?.tahunAjaran.nama,
                readOnly: true,
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <TextInput
              label='Homeroom Teacher'
              labelClassName='print:text-[10px]'
              className='print:text-[10px]'
              inputProps={{
                value: loader.kelas?.wali ? DBHelpers.akun.getDisplayName(loader.kelas.wali) : '-',
                readOnly: true,
              }}
            />
          </FilterGridItem>
        </div>
      </Card>

      <Card className='mt-4 lg:mt-8 print:shadow-none print:p-4 print:mt-4'>
        <div className='grid grid-cols-3 gap-4'>
          <FilterGridItem>
            <TextInput
              label='Start Date'
              labelClassName='print:text-[10px]'
              className='print:text-[10px]'
              inputProps={{
                type: 'date',
                value: startDate,
                onChange: e => setStartDate(e.target.value),
              }}
            />
          </FilterGridItem>
          <FilterGridItem>
            <TextInput
              label='End Date'
              labelClassName='print:text-[10px]'
              className='print:text-[10px]'
              inputProps={{
                type: 'date',
                value: endDate,
                onChange: e => setEndDate(e.target.value),
              }}
            />
          </FilterGridItem>
          <FilterGridItem className='no-print'>
            <Button
              label='Generate'
              className='w-full h-full'
              size='lg'
              startIcon={<FaPaperPlane />}
              buttonProps={{ disabled: !startDate || !endDate, onClick: onGenerate }}
            />
          </FilterGridItem>
        </div>
      </Card>

      <Card className='mt-4 lg:mt-8 print:shadow-none print:p-4 print:mt-4'>
        {notGeneratedYet ? (
          <div>
            <p className='font-bold'>Oops!</p>
            <p className='text-primary'>
              Please enter the start and end date, then click generate button to get the data.
            </p>
          </div>
        ) : !absenDataExists ? (
          <div>
            <p className='font-bold'>Oops!</p>
            <p className='text-primary'>
              There are no absence data yet on your selected dates. Please select other dates combinations.
            </p>
          </div>
        ) : (
          <div className='max-w-full overflow-x-auto print:overflow-visible'>
            <table className='box-border'>
              <thead>
                <tr>
                  <th className='sticky left-0 z-20 min-w-36 px-1 py-2 text-sm text-left border bg-white print:px-1 print:py-1 print:text-[8px] print:min-w-20'>
                    Students
                  </th>

                  {loader.absensis?.map(absensi => (
                    <th
                      key={`${sectionPrefix}-absensis-table-th-${absensi.id}`}
                      className='border px-1 py-2 text-sm bg-white print:px-1 print:py-1 print:text-[8px]'
                    >
                      {format(absensi.tanggal, constants.dateFormats.dateMonth)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loader.kelas.siswaPerKelasDanSemester.map(siswaPerKelSem => {
                  const totalHadir = loader.absensis?.reduce(
                    (total, absensi) =>
                      (total += absensi.siswaTerabsen.reduce(
                        (total2, terabsen) =>
                          (total2 +=
                            terabsen.siswaId === siswaPerKelSem.siswaId && terabsen.tipe === TipeAbsensi.HADIR ? 1 : 0),
                        0,
                      )),
                    0,
                  )
                  const totalSakit = loader.absensis?.reduce(
                    (total, absensi) =>
                      (total += absensi.siswaTerabsen.reduce(
                        (total2, terabsen) =>
                          (total2 +=
                            terabsen.siswaId === siswaPerKelSem.siswaId && terabsen.tipe === TipeAbsensi.SAKIT ? 1 : 0),
                        0,
                      )),
                    0,
                  )
                  const totalIzin = loader.absensis?.reduce(
                    (total, absensi) =>
                      (total += absensi.siswaTerabsen.reduce(
                        (total2, terabsen) =>
                          (total2 +=
                            terabsen.siswaId === siswaPerKelSem.siswaId && terabsen.tipe === TipeAbsensi.IZIN ? 1 : 0),
                        0,
                      )),
                    0,
                  )
                  const totalTanpaKeterangan = loader.absensis?.reduce(
                    (total, absensi) =>
                      (total += absensi.siswaTerabsen.reduce(
                        (total2, terabsen) =>
                          (total2 +=
                            terabsen.siswaId === siswaPerKelSem.siswaId && terabsen.tipe === TipeAbsensi.UNKNOWN
                              ? 1
                              : 0),
                        0,
                      )),
                    0,
                  )

                  return (
                    <tr key={`${sectionPrefix}-absensis-table-tr-siswaPerKelSem-${siswaPerKelSem.id}`}>
                      <td className='sticky left-0 z-10 min-w-36 p-2 border bg-white print:px-1 print:py-1 print:text-[8px] print:min-w-20'>
                        <p>{DBHelpers.akun.getDisplayName(siswaPerKelSem.siswa)}</p>
                        <div className='flex flex-row flex-wrap gap-2 items-center justify-center text-xs print:text-[8px] py-1 px-2 bg-secondary/10 rounded-xl'>
                          <p className='text-green-500'>
                            {EnumsTitleUtils.getTipeAbsensiShort(TipeAbsensi.HADIR)}:{totalHadir}
                          </p>
                          <p className='text-blue-500'>
                            {EnumsTitleUtils.getTipeAbsensiShort(TipeAbsensi.SAKIT)}:{totalSakit}
                          </p>
                          <p className='text-gray-500'>
                            {EnumsTitleUtils.getTipeAbsensiShort(TipeAbsensi.IZIN)}:{totalIzin}
                          </p>
                          <p className='text-red-500'>
                            {EnumsTitleUtils.getTipeAbsensiShort(TipeAbsensi.UNKNOWN)}:{totalTanpaKeterangan}
                          </p>
                        </div>
                      </td>

                      {loader.absensis?.map(absensi => {
                        const currAbsensi = absensi.siswaTerabsen.find(item => item.siswaId === siswaPerKelSem.siswaId)

                        return (
                          <td
                            key={`${sectionPrefix}-absensis-table-tr-siswaPerKelSem-${siswaPerKelSem.id}-absensi-${absensi.id}`}
                            className={classNames(
                              'border text-center bg-white text-sm print:text-[8px] font-semibold',
                              {
                                ['bg-green-500! text-white print:text-green-500']:
                                  currAbsensi?.tipe === TipeAbsensi.HADIR,
                                ['bg-blue-500! text-white print:text-blue-500']:
                                  currAbsensi?.tipe === TipeAbsensi.SAKIT,
                                ['bg-gray-500! text-white print:text-gray-500']: currAbsensi?.tipe === TipeAbsensi.IZIN,
                                ['bg-red-500! text-white print:text-red-500']:
                                  currAbsensi?.tipe === TipeAbsensi.UNKNOWN,
                              },
                            )}
                          >
                            {currAbsensi ? EnumsTitleUtils.getTipeAbsensiShort(currAbsensi.tipe as TipeAbsensi) : null}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
                <tr></tr>
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminPageContainer>
  )
}
