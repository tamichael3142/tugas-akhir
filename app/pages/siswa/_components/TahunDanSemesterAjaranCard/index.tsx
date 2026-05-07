import classNames from 'classnames'
import { ReactNode } from 'react'
import { Card } from '~/components/ui'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'
import { CurrentTahunAndSemesterAjaran } from '~/types/loaders-data/ortu'
import EnumsTitleUtils from '~/utils/enums-title.utils'

type Props = CurrentTahunAndSemesterAjaran & {
  className?: string
}

export default function TahunDanSemesterAjaranCard(props: Props) {
  function DetailItem({ label, children }: { label?: ReactNode; children?: ReactNode }) {
    return (
      <div className='col-span-2 lg:col-span-1 h-full'>
        <div className='text-sm font-semibold'>{label}</div>
        <div className='border-b py-2 px-1'>{children}</div>
      </div>
    )
  }

  return (
    <Card
      className={classNames('grid grid-cols-2 gap-4 lg:gap-8 print:shadow-none print:rounded-none', props.className)}
    >
      <DetailItem label='Tahun Ajaran'>{props.currentTahunAjaran?.nama}</DetailItem>
      <DetailItem label='Semester Ajaran'>
        {EnumsTitleUtils.getSemesterAjaranUrutan(props.currentSemester?.urutan as SemesterAjaranUrutan)}
      </DetailItem>
    </Card>
  )
}
