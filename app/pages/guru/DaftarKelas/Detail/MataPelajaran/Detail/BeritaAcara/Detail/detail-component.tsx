import { Days, Hour, MataPelajaranBeritaAcara } from '@prisma/client'
import classNames from 'classnames'
import { ReactNode } from 'react'

type Props = {
  beritaAcara: MataPelajaranBeritaAcara & { day: Days; hourStart: Hour; hourEnd: Hour }
}

export default function GuruDaftarKelasDetailMataPelajaranDetailBeritaAcaraDetailDetailComponent(props: Props) {
  function DetailItem({ label, colSpan = 1, children }: { label?: ReactNode; colSpan?: number; children?: ReactNode }) {
    return (
      <div
        className={classNames('col-span-3 h-full', {
          ['lg:col-span-1']: colSpan === 1,
          ['lg:col-span-2']: colSpan === 2,
          ['lg:col-span-3']: colSpan === 3,
        })}
      >
        <div className='text-sm font-semibold'>{label}</div>
        <div className='border-b py-2 px-1'>{children}</div>
      </div>
    )
  }

  return (
    <div className='pb-8 grid grid-cols-3 gap-4 lg:gap-8'>
      <DetailItem label='Title' colSpan={3}>
        {props.beritaAcara.title}
      </DetailItem>
      <DetailItem label='Day' colSpan={1}>
        {props.beritaAcara.day.label}
      </DetailItem>
      <DetailItem label='Start Hour' colSpan={1}>
        {props.beritaAcara.hourStart.label}
      </DetailItem>
      <DetailItem label='End Hour' colSpan={1}>
        {props.beritaAcara.hourEnd.label}
      </DetailItem>
      <DetailItem label='Remark' colSpan={3}>
        {props.beritaAcara.remark}
      </DetailItem>
    </div>
  )
}
