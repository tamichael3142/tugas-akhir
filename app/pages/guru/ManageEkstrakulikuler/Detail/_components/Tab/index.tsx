import { useNavigate } from '@remix-run/react'
import { TabItem, Tabs } from '~/components/ui'
import AppNav from '~/navigation'
import { LoaderDataGuruManageEkstrakulikulerDetail } from '~/types/loaders-data/guru'

export enum TabKey {
  DAFTAR_SISWA = 'daftar-siswa',
  ASSESSMENT = 'assessment',
}

export type GuruManageEkstrakulikulerDetailTabProps = {
  activeTabKey?: TabKey
  ekstrakulikuler?: LoaderDataGuruManageEkstrakulikulerDetail['ekstrakulikuler']
}

export default function GuruManageEkstrakulikulerDetailTab(props: GuruManageEkstrakulikulerDetailTabProps) {
  const { activeTabKey = TabKey.DAFTAR_SISWA, ekstrakulikuler } = props
  const navigate = useNavigate()

  const items: TabItem[] = [
    { key: TabKey.DAFTAR_SISWA, label: 'Student List' },
    { key: TabKey.ASSESSMENT, label: 'Assessment' },
  ]

  if (!ekstrakulikuler) return null
  return (
    <Tabs
      activeItemKey={activeTabKey}
      onTabClick={newTab => {
        if (newTab === TabKey.DAFTAR_SISWA)
          navigate(AppNav.guru.manageEkstrakulikulerDetailDaftarSiswa({ ekstrakulikulerId: ekstrakulikuler.id }))
        else if (newTab === TabKey.ASSESSMENT)
          navigate(AppNav.guru.manageEkstrakulikulerDetailAssessment({ ekstrakulikulerId: ekstrakulikuler.id }))
      }}
      items={items}
    />
  )
}
