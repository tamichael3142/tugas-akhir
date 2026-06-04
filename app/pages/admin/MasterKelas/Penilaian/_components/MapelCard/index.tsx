import { Akun, Kompetensi, SiswaPerKelasDanSemester } from '@prisma/client'
import classNames from 'classnames'
import DBHelpers from '~/database/helpers'
import { LoaderDataAdminMasterKelasPenilaian } from '~/types/loaders-data/admin'

type Props = {
  index: number
  mapel: LoaderDataAdminMasterKelasPenilaian['mataPelajarans'][0]
  kompetensis: Kompetensi[]
  siswaPerKelasDanSemester: (SiswaPerKelasDanSemester & { siswa: Akun })[]
}

const sectionPrefix = 'admin-master-kelas-penilaian-mapel-card'

export default function MapelCard(props: Props) {
  return (
    <div>
      <h2
        className={classNames(
          'font-semibold text-lg mb-2 w-fit min-w-32 px-4 py-1 rounded-xl print:px-1 print:py-1 print:text-sm',
          {
            ['bg-primary/10 text-primary']: props.index % 2 === 0,
            ['bg-secondary/10 text-secondary']: props.index % 2 !== 0,
          },
        )}
      >
        {props.mapel.nama}
      </h2>

      <div className='max-w-full overflow-x-auto'>
        <table className='box-border border-collapse'>
          <thead>
            <tr>
              <th className='sticky left-0 z-20 min-w-36 px-2 py-4 text-left border bg-white print:px-1 print:py-1 print:text-[8px] print:min-w-20'>
                Students
              </th>

              {props.kompetensis.map(kompetensi => (
                <th
                  key={`${sectionPrefix}-${props.mapel.id}-thead-kompetensi-${kompetensi.id}`}
                  className='min-w-32 px-2 py-4 border bg-white print:px-1 print:py-2 print:text-[8px] print:w-16 print:min-w-0 print:break-all'
                >
                  {kompetensi.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {props.siswaPerKelasDanSemester.map(siswaPerKelSem => {
              return (
                <tr key={`${sectionPrefix}-${props.mapel.id}-tbody-siswaPerKelSem-${siswaPerKelSem.id}`}>
                  <td className='sticky left-0 z-10 min-w-36 p-2 border bg-white print:px-1 print:py-1 print:text-[8px] print:min-w-20'>
                    {DBHelpers.akun.getDisplayName(siswaPerKelSem.siswa)}
                  </td>

                  {props.kompetensis.map(kompetensi => {
                    const penilaian = props.mapel.penilaians.find(item => item.siswaId === siswaPerKelSem.siswaId)

                    return (
                      <td
                        key={`${sectionPrefix}-${props.mapel.id}-tbody-siswaPerKelSem-${siswaPerKelSem.id}-kompetensi-${kompetensi.id}-nilai`}
                        className='bg-white border text-center print:text-[8px] print:w-16 print:min-w-0'
                      >
                        {penilaian?.nilai ? Number(penilaian.nilai) : '-'}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
