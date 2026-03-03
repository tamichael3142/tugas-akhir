import { useNavigate } from '@remix-run/react'
import { TabItem, Tabs } from '~/components/ui'
import AppNav from '~/navigation'

export enum TabKey {
  DAFTAR_SISWA = 'daftar-siswa',
  MATA_PELAJARAN = 'mata-pelajaran',
}

export type GuruDaftarKelasDetailTabProps = {
  activeTabKey?: TabKey
  kelasId?: string
}

export default function GuruDaftarKelasDetailTab(props: GuruDaftarKelasDetailTabProps) {
  const { activeTabKey = TabKey.DAFTAR_SISWA, kelasId = '' } = props
  const navigate = useNavigate()

  const items: TabItem[] = [
    { key: TabKey.DAFTAR_SISWA, label: 'Daftar Siswa' },
    { key: TabKey.MATA_PELAJARAN, label: 'Mata Pelajaran' },
  ]

  return (
    <Tabs
      activeItemKey={activeTabKey}
      onTabClick={newTab => {
        if (newTab === TabKey.DAFTAR_SISWA) navigate(AppNav.guru.daftarKelasDetailDaftarSiswa({ kelasId }))
        else if (newTab === TabKey.MATA_PELAJARAN) navigate(AppNav.guru.daftarKelasDetailMataPelajaran({ kelasId }))
      }}
      items={items}
    />
  )
}
