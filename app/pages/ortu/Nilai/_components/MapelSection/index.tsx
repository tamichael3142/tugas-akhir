import { Kompetensi, MataPelajaran, Penilaian } from '@prisma/client'

type Props = {
  mataPelajaran: MataPelajaran
  kompetensis: Kompetensi[]
  allPenilaians: (Penilaian & { nilai: number })[]
}

export default function MapelSection(props: Props) {
  return (
    <div className='max-w-full overflow-x-auto print:overflow-x-visible p-4 print:p-0 bg-gray-100 rounded-2xl'>
      <h3 className='mb-2 font-semibold text lg'>Subject: {props.mataPelajaran.nama}</h3>
      <table className='box-border'>
        <thead>
          <tr>
            {props.kompetensis.map(item => (
              <th key={`th-kompetensi-${item.id}`} className='p-2 border min-w-32 print:min-w-16 print:text-xs h-12'>
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {props.kompetensis.map(item => {
              const currNilai = props.allPenilaians.find(penilaian => penilaian.kompetensiId === item.id)

              return (
                <td
                  key={`td-nilai-${item.id}`}
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
  )
}
