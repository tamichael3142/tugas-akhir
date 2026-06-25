import { Akun } from '@prisma/client'
import classNames from 'classnames'
import { format } from 'date-fns'
import { ReactNode } from 'react'
import constants from '~/constants'
import { GolonganDarah, JenisKelamin, Kewarganegaraan, Role } from '~/database/enums/prisma.enums'
import EnumsTitleUtils from '~/utils/enums-title.utils'

type Props = {
  account: Akun & { profileImageObjectUrl?: string }
  totalPoint: number
}

const FIRST_TRESSHOLD = 50
const SECOND_TRESSHOLD = 75

export default function GuruDaftarKelasDetailDetailSiswaPageDataDetailComponent(props: Props) {
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
      <DetailItem label='First Name' colSpan={1}>
        {props.account.firstName ?? '-'}
      </DetailItem>
      <DetailItem label='Last Name' colSpan={1}>
        {props.account.lastName ?? '-'}
      </DetailItem>
      <DetailItem label='Birth Date' colSpan={1}>
        {props.account.tanggalLahir ? format(props.account.tanggalLahir, constants.dateFormats.displayFullDate) : '-'}
      </DetailItem>
      <DetailItem label='NIP' colSpan={2}>
        {props.account.nip ?? '-'}
      </DetailItem>
      <DetailItem label='Role' colSpan={1}>
        {EnumsTitleUtils.getRole(props.account.role as Role)}
      </DetailItem>
      <DetailItem label='Username' colSpan={2}>
        {props.account.username}
      </DetailItem>
      <DetailItem label='Gender' colSpan={1}>
        {EnumsTitleUtils.getJenisKelamin(props.account.jenisKelamin as JenisKelamin)}
      </DetailItem>
      <DetailItem label='Email' colSpan={1}>
        {props.account.email ?? '-'}
      </DetailItem>
      <DetailItem label='Birth Place' colSpan={1}>
        {props.account.tempatLahir ?? '-'}
      </DetailItem>
      <DetailItem label='Religion' colSpan={1}>
        {props.account.agama ?? '-'}
      </DetailItem>
      <DetailItem label='Address' colSpan={3}>
        {props.account.alamat ?? '-'}
      </DetailItem>
      <DetailItem label='Blood Type' colSpan={1}>
        {EnumsTitleUtils.getGolonganDarah(props.account.golonganDarah as GolonganDarah)}
      </DetailItem>
      <DetailItem label='Nationality' colSpan={1}>
        {EnumsTitleUtils.getKewarganegaraan(props.account.kewarganegaraan as Kewarganegaraan)}
      </DetailItem>
      <DetailItem label='Total Violation Point' colSpan={1}>
        <div
          className={classNames('rounded-lg p-1 w-fit', {
            ['bg-yellow-300']: props.totalPoint >= FIRST_TRESSHOLD && props.totalPoint < SECOND_TRESSHOLD,
            ['bg-red-500 text-white']: props.totalPoint >= SECOND_TRESSHOLD,
          })}
        >
          {props.totalPoint}
          {props.totalPoint >= FIRST_TRESSHOLD && props.totalPoint < SECOND_TRESSHOLD
            ? ' (Exceeding first tresshold!)'
            : props.totalPoint >= SECOND_TRESSHOLD
              ? ' (Exceeding second tresshold!)'
              : null}
        </div>
      </DetailItem>
    </div>
  )
}
