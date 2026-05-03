import { Absensi, AbsensiXSiswa, Akun, Kelas } from '@prisma/client'
import { format } from 'date-fns'
import { useMemo } from 'react'
import { Card } from '~/components/ui'
import constants from '~/constants'
import { TipeAbsensi } from '~/database/enums/prisma.enums'
import { LoaderDataOrtuAbsensi } from '~/types/loaders-data/ortu'
import EnumsTitleUtils from '~/utils/enums-title.utils'

type Props = {
  sectionPrefix: string
  siswaId: string
  currentTahunAjaran: LoaderDataOrtuAbsensi['currentTahunAjaran']
  currentSemester: LoaderDataOrtuAbsensi['currentSemester']
  kelass: LoaderDataOrtuAbsensi['kelass']
}

type CurrAbsensi = Absensi & { siswaTerabsen: AbsensiXSiswa[] }

export default function AbsensiTable(props: Props) {
  const mergedDates = useMemo(() => {
    const result: Date[] = []
    props.kelass?.forEach(kelas => {
      kelas.absensis.map(absensi => {
        if (!result.includes(absensi.tanggal)) result.push(absensi.tanggal)
      })
    })

    return result.sort((a, b) => (a > b ? 1 : -1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.kelass])

  function getCurrentAbsensi(date: Date, kelasId: Kelas['id']): CurrAbsensi | null {
    const currKelas = props.kelass?.find(kelas => kelas.id === kelasId)
    if (currKelas) {
      return currKelas.absensis.find(absensi => absensi.tanggal === date) ?? null
    }
    return null
  }

  function getSiswaAbsensiStatus(absensi: CurrAbsensi | null, siswaId: Akun['id']) {
    return absensi?.siswaTerabsen.find(item => item.siswaId === siswaId) ?? null
  }

  return (
    <Card className='mt-8 max-w-full overflow-x-auto print:shadow-none print:rounded-none'>
      <table className='box-border'>
        <thead>
          <tr>
            <th className='p-2 min-w-32 border'>Date</th>
            {props.kelass?.map(kelas => (
              <th key={`${props.sectionPrefix}-absensi-table-th-kelas-${kelas.id}`} className='p-2 min-w-44 border'>
                <p className='text-secondary'>{kelas.nama}</p>
                <div className='flex flex-row flex-wrap gap-2 items-center justify-center text-xs'>
                  <p className='text-green-500'>H:{kelas.stats.totalHadir}</p>
                  <p className='text-blue-500'>S:{kelas.stats.totalSakit}</p>
                  <p className='text-gray-500'>I:{kelas.stats.totalIzin}</p>
                  <p className='text-red-500'>TK:{kelas.stats.totalTanpaKeterangan}</p>
                  <p className='text-black'>
                    X:
                    {mergedDates.length -
                      (kelas.stats.totalHadir +
                        kelas.stats.totalSakit +
                        kelas.stats.totalIzin +
                        kelas.stats.totalTanpaKeterangan)}
                  </p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mergedDates.map(item => (
            <tr key={`${props.sectionPrefix}-absensi-table-tr-dates-${item.getTime()}`}>
              <td className='p-2 min-w-32 border text-center'>
                {format(item, constants.dateFormats.displayCompactDate1)}
              </td>
              {props.kelass?.map(kelas => {
                const currAbsensi = getCurrentAbsensi(item, kelas.id)
                const currStatus = getSiswaAbsensiStatus(currAbsensi, props.siswaId)

                return (
                  <td
                    key={`${props.sectionPrefix}-absensi-table-tr-dates-${item.getTime()}-td-${kelas.id}`}
                    className='p-2 min-w-44 border text-center'
                  >
                    {EnumsTitleUtils.getTipeAbsensi(currStatus?.tipe as TipeAbsensi)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
