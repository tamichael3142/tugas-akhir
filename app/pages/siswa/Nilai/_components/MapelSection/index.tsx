import { Kompetensi, MataPelajaran, Penilaian } from '@prisma/client'

type Props = {
  mataPelajaran: MataPelajaran
  kompetensis: Kompetensi[]
  allPenilaians: (Penilaian & { nilai: number })[]
}

export default function MapelSection(props: Props) {
  return (
    <div className='col-span-2 md:col-span-1 print:col-span-1 p-4 print:p-0 bg-gray-100 rounded-2xl'>
      <h3 className='mb-2 font-semibold text lg'>Subject: {props.mataPelajaran.nama}</h3>
      <table className='box-border w-full'>
        <thead>
          <tr className='w-full'>
            <th className='border p-2 print:text-xs w-1/2'>Competence</th>
            <th className='border p-2 print:text-xs w-1/2'>Assessment</th>
          </tr>
        </thead>
        <tbody>
          {props.kompetensis.map(item => {
            const currNilai = props.allPenilaians.find(penilaian => penilaian.kompetensiId === item.id)

            return (
              <tr key={`siswa-nilai-${props.mataPelajaran.id}-tr-${item.id}`}>
                <td className='border p-2 print:text-xs text-center'>{item.label}</td>
                <td className='border p-2 print:text-xs text-center'>{currNilai ? currNilai.nilai : '-'}</td>
              </tr>
            )
          })}
          {/* <tr>
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
          </tr> */}
        </tbody>
      </table>
    </div>
  )
}
