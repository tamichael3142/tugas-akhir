import { Kelas, SemesterAjaran, TahunAjaran } from '@prisma/client'
import { useNavigate } from '@remix-run/react'
import { TabItem, Tabs } from '~/components/ui'
import AppNav from '~/navigation'

export enum TabKey {
  MATA_PELAJARAN = 'mata-pelajaran',
}

export type SiswaKelasDetailTabProps = {
  activeTabKey?: TabKey
  kelas?: Kelas & { tahunAjaran: TahunAjaran & { semesterAjaran: SemesterAjaran[] } }
}

export default function SiswaKelasDetailTab(props: SiswaKelasDetailTabProps) {
  const { activeTabKey = TabKey.MATA_PELAJARAN, kelas } = props
  const navigate = useNavigate()

  const items: TabItem[] = [{ key: TabKey.MATA_PELAJARAN, label: 'Mata Pelajaran' }]

  if (!kelas) return null
  return (
    <Tabs
      variant='secondary'
      activeItemKey={activeTabKey}
      onTabClick={newTab => {
        if (newTab === TabKey.MATA_PELAJARAN)
          navigate(
            AppNav.siswa.kelasDetailDaftarSiswa({
              kelasId: kelas.id,
            }),
          )
      }}
      items={items}
    />
  )
}
