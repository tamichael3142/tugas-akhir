import { Ekstrakulikuler, KompetensiEkstrakulikuler, PenilaianExtrakulikuler } from '@prisma/client'
import classNames from 'classnames'
import { Card } from '~/components/ui'

type Props = {
  ekstrakulikuler: Ekstrakulikuler
  kompetensiEkstrakulikulers: KompetensiEkstrakulikuler[]
  penilaianEkstrakulikulers: (PenilaianExtrakulikuler & { nilai: number })[]
  className?: string
}

export default function EkstrakulikulerCard(props: Props) {
  return (
    <Card className={classNames('print:shadow-none print:rounded-none', props.className)}>
      <h2 className='font-semibold text-lg mb-4 text-secondary'>{props.ekstrakulikuler.nama} Extracurricular</h2>

      <div className='max-w-full overflow-x-auto print:overflow-x-visible p-4 print:p-0 bg-gray-100 rounded-2xl'>
        <table className='box-border'>
          <thead>
            <tr>
              {props.kompetensiEkstrakulikulers.map(item => (
                <th
                  key={`th-kompetensi-ekstrakulikuler-${item.id}`}
                  className='p-2 border min-w-32 print:min-w-16 print:text-xs h-12'
                >
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {props.kompetensiEkstrakulikulers.map(item => {
                const currNilai = props.penilaianEkstrakulikulers.find(
                  penilaian =>
                    penilaian.kompetensiEkstrakulikulerId === item.id &&
                    penilaian.ekstrakulikulerId === props.ekstrakulikuler.id,
                )

                return (
                  <td
                    key={`td-nilai-ekstrakulikuler-${item.id}`}
                    className='p-2 border min-w-32 print:min-w-16 print:text-xs h-12 text-center'
                  >
                    {currNilai ? currNilai.nilai : '-'}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
}
