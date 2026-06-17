import { useNavigate } from '@remix-run/react'
import { TabItem, Tabs } from '~/components/ui'
import AppNav from '~/navigation'
import useAuthStore from '~/store/authStore'
import { LoaderDataGuruDaftarKelasDetailDaftarSiswa } from '~/types/loaders-data/guru'

export enum TabKey {
  DAFTAR_SISWA = 'daftar-siswa',
  MATA_PELAJARAN = 'mata-pelajaran',
  ABSENSI = 'absensi',
  HOMEROOM_NOTES = 'homeroom-notes',
}

export type GuruDaftarKelasDetailTabProps = {
  activeTabKey?: TabKey
  kelas?: LoaderDataGuruDaftarKelasDetailDaftarSiswa['kelas']
}

export default function GuruDaftarKelasDetailTab(props: GuruDaftarKelasDetailTabProps) {
  const { activeTabKey = TabKey.DAFTAR_SISWA, kelas } = props
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)

  const items: TabItem[] = [
    { key: TabKey.DAFTAR_SISWA, label: 'Student List' },
    { key: TabKey.MATA_PELAJARAN, label: 'Subject' },
    { key: TabKey.ABSENSI, label: 'Attendance', disabled: kelas?.waliId !== user?.id },
    { key: TabKey.HOMEROOM_NOTES, label: 'Student Reports', disabled: kelas?.waliId !== user?.id },
  ]

  if (!kelas) return null
  return (
    <Tabs
      activeItemKey={activeTabKey}
      onTabClick={newTab => {
        if (newTab === TabKey.DAFTAR_SISWA)
          navigate(
            AppNav.guru.daftarKelasDetailDaftarSiswa({
              kelasId: kelas.id,
              semesterAjaranId: kelas.tahunAjaran.semesterAjaran[0].id,
            }),
          )
        else if (newTab === TabKey.MATA_PELAJARAN)
          navigate(AppNav.guru.daftarKelasDetailMataPelajaran({ kelasId: kelas.id }))
        else if (newTab === TabKey.ABSENSI) navigate(AppNav.guru.daftarKelasDetailAbsensiList({ kelasId: kelas.id }))
        else if (newTab === TabKey.HOMEROOM_NOTES)
          navigate(AppNav.guru.daftarKelasDetailHomeroomNotes({ kelasId: kelas.id }))
      }}
      items={items}
    />
  )
}
