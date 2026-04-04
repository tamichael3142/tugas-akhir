import { Kelas, MataPelajaran } from '@prisma/client'
import { useNavigate } from '@remix-run/react'
import { TabItem, Tabs } from '~/components/ui'
import AppNav from '~/navigation'
import useAuthStore from '~/store/authStore'

export enum TabKey {
  ASSIGNMENT = 'assignment',
  ATTACHMENT = 'attachment',
  PENILAIAN = 'penilaian',
  PELANGGARAN = 'pelanggaran',
}

export type GuruManageMataPelajaranDetailTabProps = {
  activeTabKey?: TabKey
  kelas: Kelas
  mataPelajaran?: MataPelajaran
}

export default function GuruManageMataPelajaranDetailTab(props: GuruManageMataPelajaranDetailTabProps) {
  const { activeTabKey = TabKey.ASSIGNMENT, kelas, mataPelajaran } = props
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)

  const items: TabItem[] = [
    { key: TabKey.ASSIGNMENT, label: 'Tugas' },
    { key: TabKey.ATTACHMENT, label: 'Lampiran' },
    { key: TabKey.PENILAIAN, label: 'Penilaian', disabled: mataPelajaran?.guruId !== user?.id },
    { key: TabKey.PELANGGARAN, label: 'Pelanggaran' },
  ]

  if (!mataPelajaran) return null
  return (
    <Tabs
      activeItemKey={activeTabKey}
      onTabClick={newTab => {
        if (newTab === TabKey.ASSIGNMENT)
          navigate(
            AppNav.guru.daftarKelasDetailMataPelajaranDetailAssignment({
              kelasId: kelas.id,
              mataPelajaranId: mataPelajaran.id,
            }),
          )
        else if (newTab === TabKey.ATTACHMENT)
          navigate(
            AppNav.guru.daftarKelasDetailMataPelajaranDetailAttachment({
              kelasId: kelas.id,
              mataPelajaranId: mataPelajaran.id,
            }),
          )
        else if (newTab === TabKey.PENILAIAN)
          navigate(
            AppNav.guru.daftarKelasDetailMataPelajaranDetailPenilaian({
              kelasId: kelas.id,
              mataPelajaranId: mataPelajaran.id,
            }),
          )
        else if (newTab === TabKey.PELANGGARAN)
          navigate(AppNav.guru.manageMataPelajaranDetailPelanggaran({ mataPelajaranId: mataPelajaran.id }))
      }}
      items={items}
    />
  )
}
