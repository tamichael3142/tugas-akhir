import { Kelas } from '@prisma/client'
import { useNavigate } from '@remix-run/react'
import { TabItem, Tabs } from '~/components/ui'
import AppNav from '~/navigation'
import useAuthStore from '~/store/authStore'

export enum TabKey {
  DAFTAR_SISWA = 'daftar-siswa',
  MATA_PELAJARAN = 'mata-pelajaran',
  ABSENSI = 'absensi',
}

export type GuruDaftarKelasDetailTabProps = {
  activeTabKey?: TabKey
  kelas?: Kelas
}

export default function GuruDaftarKelasDetailTab(props: GuruDaftarKelasDetailTabProps) {
  const { activeTabKey = TabKey.DAFTAR_SISWA, kelas } = props
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)

  const items: TabItem[] = [
    { key: TabKey.DAFTAR_SISWA, label: 'Daftar Siswa' },
    { key: TabKey.MATA_PELAJARAN, label: 'Mata Pelajaran' },
    { key: TabKey.ABSENSI, label: 'Absensi', disabled: kelas?.waliId !== user?.id },
  ]

  if (!kelas) return null
  return (
    <Tabs
      activeItemKey={activeTabKey}
      onTabClick={newTab => {
        if (newTab === TabKey.DAFTAR_SISWA) navigate(AppNav.guru.daftarKelasDetailDaftarSiswa({ kelasId: kelas.id }))
        else if (newTab === TabKey.MATA_PELAJARAN)
          navigate(AppNav.guru.daftarKelasDetailMataPelajaran({ kelasId: kelas.id }))
        else if (newTab === TabKey.ABSENSI) navigate(AppNav.guru.daftarKelasDetailAbsensiList({ kelasId: kelas.id }))
      }}
      items={items}
    />
  )
}
