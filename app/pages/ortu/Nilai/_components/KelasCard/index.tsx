import { JadwalPelajaran, Kelas, Kompetensi, MataPelajaran, Penilaian } from '@prisma/client'
import classNames from 'classnames'
import { Card } from '~/components/ui'
import MapelSection from '../MapelSection'

type Props = {
  kelas: Kelas & {
    jadwalPelajarans: (JadwalPelajaran & {
      mataPelajaran: MataPelajaran
    })[]
    penilaians: (Penilaian & {
      nilai: number
    })[]
  }
  kompetensis: Kompetensi[]
  className?: string
}

export default function KelasCard(props: Props) {
  return (
    <Card className={classNames('print:shadow-none print:rounded-none', props.className)}>
      <h2 className='font-semibold text-lg mb-4 text-secondary'>{props.kelas.nama} Class</h2>

      <div className='space-y-4'>
        {props.kelas.jadwalPelajarans.map(item => (
          <MapelSection
            key={`kelas-card-${props.kelas.id}-mapel-section-${item.id}`}
            kompetensis={props.kompetensis}
            mataPelajaran={item.mataPelajaran}
            allPenilaians={props.kelas.penilaians}
          />
        ))}
      </div>
    </Card>
  )
}
