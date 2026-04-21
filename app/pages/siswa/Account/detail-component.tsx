import { Akun } from '@prisma/client'
import classNames from 'classnames'
import { format } from 'date-fns'
import { ReactNode } from 'react'
import constants from '~/constants'
import { JenisKelamin, Role } from '~/database/enums/prisma.enums'
import EnumsTitleUtils from '~/utils/enums-title.utils'

type Props = {
  account: Akun & { profileImageObjectUrl?: string }
}

export default function SiswaAccountSelfUpdateDetailComponent(props: Props) {
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
      <DetailItem label='Nama Depan' colSpan={1}>
        {props.account.firstName}
      </DetailItem>
      <DetailItem label='Nama Belakang' colSpan={1}>
        {props.account.lastName}
      </DetailItem>
      <DetailItem label='Tanggal Lahir' colSpan={1}>
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
      <DetailItem label='Jenis Kelamin' colSpan={1}>
        {EnumsTitleUtils.getJenisKelamin(props.account.jenisKelamin as JenisKelamin)}
      </DetailItem>
    </div>
  )
}
