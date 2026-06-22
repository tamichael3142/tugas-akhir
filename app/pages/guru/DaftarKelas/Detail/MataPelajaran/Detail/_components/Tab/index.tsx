import { Kelas, MataPelajaran } from '@prisma/client'
import { useNavigate } from '@remix-run/react'
import { FaBookOpen, FaFileAlt } from 'react-icons/fa'
import { MdAssignment, MdFactCheck } from 'react-icons/md'
import { GrAttachment } from 'react-icons/gr'
import { TabItem, Tabs } from '~/components/ui'
import AppNav from '~/navigation'
import useAuthStore from '~/store/authStore'

export enum TabKey {
  BERITA_ACARA = 'berita-acara',
  ASSIGNMENT = 'assignment',
  ATTACHMENT = 'attachment',
  PENILAIAN = 'penilaian',
  REPORT_DESCRIPTIONS = 'report-descriptions',
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
    { key: TabKey.BERITA_ACARA, label: 'Daily Report', icon: <FaBookOpen /> },
    { key: TabKey.ASSIGNMENT, label: 'Assignment', icon: <MdAssignment /> },
    { key: TabKey.ATTACHMENT, label: 'Attachment', icon: <GrAttachment /> },
    { key: TabKey.PENILAIAN, label: 'Assessment', icon: <MdFactCheck />, disabled: mataPelajaran?.guruId !== user?.id },
    { key: TabKey.REPORT_DESCRIPTIONS, label: 'Report', icon: <FaFileAlt /> },
  ]

  if (!mataPelajaran) return null
  return (
    <Tabs
      activeItemKey={activeTabKey}
      onTabClick={newTab => {
        if (newTab === TabKey.BERITA_ACARA)
          navigate(
            AppNav.guru.daftarKelasDetailMataPelajaranDetailBeritaAcara({
              kelasId: kelas.id,
              mataPelajaranId: mataPelajaran.id,
            }),
          )
        else if (newTab === TabKey.ASSIGNMENT)
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
        else if (newTab === TabKey.REPORT_DESCRIPTIONS)
          navigate(
            AppNav.guru.daftarKelasDetailMataPelajaranDetailReportDescriptions({
              kelasId: kelas.id,
              mataPelajaranId: mataPelajaran.id,
            }),
          )
      }}
      items={items}
    />
  )
}
