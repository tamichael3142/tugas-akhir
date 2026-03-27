import { MataPelajaran } from '@prisma/client'
import { useNavigate } from '@remix-run/react'
import { TabItem, Tabs } from '~/components/ui'
import AppNav from '~/navigation'
import useAuthStore from '~/store/authStore'

export enum TabKey {
  ASSIGNMENT = 'assignment',
  ATTACHMENT = 'attachment',
  NILAI = 'nilai',
  PELANGGARAN = 'pelanggaran',
}

export type GuruManageMataPelajaranDetailTabProps = {
  activeTabKey?: TabKey
  mataPelajaran?: MataPelajaran
}

export default function GuruManageMataPelajaranDetailTab(props: GuruManageMataPelajaranDetailTabProps) {
  const { activeTabKey = TabKey.ASSIGNMENT, mataPelajaran } = props
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)

  const items: TabItem[] = [
    { key: TabKey.ASSIGNMENT, label: 'Tugas' },
    { key: TabKey.ATTACHMENT, label: 'Lampiran' },
    { key: TabKey.NILAI, label: 'Nilai', disabled: mataPelajaran?.guruId !== user?.id },
    { key: TabKey.PELANGGARAN, label: 'Pelanggaran' },
  ]

  if (!mataPelajaran) return null
  return (
    <Tabs
      activeItemKey={activeTabKey}
      onTabClick={newTab => {
        if (newTab === TabKey.ASSIGNMENT)
          navigate(AppNav.guru.manageMataPelajaranDetailAssignment({ mataPelajaranId: mataPelajaran.id }))
        else if (newTab === TabKey.ATTACHMENT)
          navigate(AppNav.guru.manageMataPelajaranDetailAttachment({ mataPelajaranId: mataPelajaran.id }))
        else if (newTab === TabKey.NILAI)
          navigate(AppNav.guru.manageMataPelajaranDetailNilai({ mataPelajaranId: mataPelajaran.id }))
        else if (newTab === TabKey.PELANGGARAN)
          navigate(AppNav.guru.manageMataPelajaranDetailPelanggaran({ mataPelajaranId: mataPelajaran.id }))
      }}
      items={items}
    />
  )
}
