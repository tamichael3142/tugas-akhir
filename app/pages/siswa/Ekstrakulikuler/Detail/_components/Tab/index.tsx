import { Ekstrakulikuler } from '@prisma/client'
import { MdFactCheck } from 'react-icons/md'
import { TabItem, Tabs } from '~/components/ui'

export enum TabKey {
  ASSESSMENT = 'assessment',
}

export type SiswaEkstrakulikulerDetailTabProps = {
  activeTabKey?: TabKey
  ekstrakulikuler?: Ekstrakulikuler | null
}

export default function SiswaEkstrakulikulerDetailTab(props: SiswaEkstrakulikulerDetailTabProps) {
  const { activeTabKey = TabKey.ASSESSMENT, ekstrakulikuler } = props

  const items: TabItem[] = [{ key: TabKey.ASSESSMENT, label: 'Assessment', icon: <MdFactCheck /> }]

  if (!ekstrakulikuler) return null
  return <Tabs variant='secondary' activeItemKey={activeTabKey} items={items} />
}
