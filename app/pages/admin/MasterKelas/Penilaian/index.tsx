import { useLoaderData, useRevalidator } from '@remix-run/react'
import { Button, Checkbox, TextInput } from '~/components/forms'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import { FaPrint } from 'react-icons/fa6'
import { LoaderDataAdminMasterKelasAssessment } from '~/types/loaders-data/admin'
import AdminPageContainer from '~/layouts/admin/AdminPageContainer'
import EnumsTitleUtils from '~/utils/enums-title.utils'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import MapelCard from './_components/MapelCard'
import { ReactNode, useState } from 'react'
import DBHelpers from '~/database/helpers'
import classNames from 'classnames'

const sectionPrefix = 'admin-master-kelas-penilaian'

export default function AdminMasterKelasPenilaianPage() {
  const loader = useLoaderData<LoaderDataAdminMasterKelasAssessment>()
  const revalidator = useRevalidator()

  const [showPrintSmt1, setShowPrintSmt1] = useState<boolean>(true)
  const [showPrintSmt2, setShowPrintSmt2] = useState<boolean>(true)

  const semester1 = loader.kelas.tahunAjaran.semesterAjaran.find(item => item.urutan === SemesterAjaranUrutan.SATU)
  const semester2 = loader.kelas.tahunAjaran.semesterAjaran.find(item => item.urutan === SemesterAjaranUrutan.DUA)

  const siswaSemester1 = loader.kelas.siswaPerKelasDanSemester.filter(item => item.semesterAjaranId === semester1?.id)
  const siswaSemester2 = loader.kelas.siswaPerKelasDanSemester.filter(item => item.semesterAjaranId === semester2?.id)

  const mapelSemester1 = loader.mataPelajarans.filter(item => item.semesterAjaranId === semester1?.id)
  const mapelSemester2 = loader.mataPelajarans.filter(item => item.semesterAjaranId === semester2?.id)

  function FilterGridItem({ children }: { children?: ReactNode }) {
    return <div className='col-span-3 md:col-span-1'>{children}</div>
  }

  if (revalidator.state === 'loading') return <LoadingFullScreen />
  return (
    <AdminPageContainer
      title='Class Assessment'
      actions={[
        <Button
          key={`${sectionPrefix}-print-button`}
          label='Print'
          color='secondary'
          startIcon={<FaPrint />}
          onlyIconOnSmallView
          buttonProps={{ onClick: () => window.print(), disabled: !showPrintSmt1 && !showPrintSmt2 }}
        />,
        <BackButton key={`${sectionPrefix}-back-button`} />,
      ]}
      className='pb-60'
    >
      <Card className='print:rounded-none print:shadow-none'>
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

      <Card
        className={classNames('mt-4 lg:mt-8 print:rounded-none print:shadow-none', {
          ['no-print']: !showPrintSmt1,
        })}
      >
        <div className='flex flex-row items-start gap-4'>
          <h1 className='text-xl print:text-base font-semibold mb-2'>{`${EnumsTitleUtils.getSemesterAjaranUrutan(SemesterAjaranUrutan.SATU)} Semester`}</h1>
          <div className='grow'></div>
          <Checkbox
            className='no-print'
            label='Show In Print?'
            labelPosition='right'
            inputProps={{
              id: 'smt1-print-chb',
              checked: showPrintSmt1,
              onChange: () => setShowPrintSmt1(oldVal => !oldVal),
            }}
          />
        </div>

        <div className='flex flex-col gap-y-4 lg:gap-y-8'>
          {mapelSemester1.map((mapel, index) => (
            <MapelCard
              key={`${sectionPrefix}-mapel-${mapel.id}`}
              index={index}
              mapel={mapel}
              kompetensis={loader.kompetensis}
              siswaPerKelasDanSemester={siswaSemester1}
            />
          ))}
        </div>
      </Card>

      <Card
        className={classNames('mt-4 lg:mt-8 print:rounded-none print:shadow-none', {
          ['no-print']: !showPrintSmt2,
        })}
      >
        <div className='flex flex-row items-start gap-4'>
          <h1 className='text-xl print:text-base font-semibold mb-2'>{`${EnumsTitleUtils.getSemesterAjaranUrutan(SemesterAjaranUrutan.DUA)} Semester`}</h1>
          <div className='grow'></div>
          <Checkbox
            className='no-print'
            label='Show In Print?'
            labelPosition='right'
            inputProps={{
              id: 'smt2-print-chb',
              checked: showPrintSmt2,
              onChange: () => setShowPrintSmt2(oldVal => !oldVal),
            }}
          />
        </div>

        <div className='flex flex-col gap-y-4 lg:gap-y-8'>
          {mapelSemester2.map((mapel, index) => (
            <MapelCard
              key={`${sectionPrefix}-mapel-${mapel.id}`}
              index={index}
              mapel={mapel}
              kompetensis={loader.kompetensis}
              siswaPerKelasDanSemester={siswaSemester2}
            />
          ))}
        </div>
      </Card>
    </AdminPageContainer>
  )
}
