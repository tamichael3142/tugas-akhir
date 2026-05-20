import { Kelas, MataPelajaran } from '@prisma/client'
import { useNavigate } from '@remix-run/react'
import { MdAssignment, MdFactCheck } from 'react-icons/md'
import { GrAttachment } from 'react-icons/gr'
import { TabItem, Tabs } from '~/components/ui'
import { BiSolidErrorAlt } from 'react-icons/bi'
import AppNav from '~/navigation'

export enum TabKey {
  ASSIGNMENT = 'assignment',
  ATTACHMENT = 'attachment',
  PENILAIAN = 'penilaian',
  PELANGGARAN = 'pelanggaran',
}

export type SiswaKelasDetailMataPelajaranDetailTabProps = {
  activeTabKey?: TabKey
  kelas: Kelas
  mataPelajaran?: MataPelajaran
}

export default function SiswaKelasDetailMataPelajaranDetailTab(props: SiswaKelasDetailMataPelajaranDetailTabProps) {
  const { activeTabKey = TabKey.ASSIGNMENT, kelas, mataPelajaran } = props
  const navigate = useNavigate()

  const items: TabItem[] = [
    { key: TabKey.ASSIGNMENT, label: 'Assignment', icon: <MdAssignment /> },
    { key: TabKey.ATTACHMENT, label: 'Attachment', icon: <GrAttachment /> },
    { key: TabKey.PENILAIAN, label: 'Assessment', icon: <MdFactCheck /> },
    { key: TabKey.PELANGGARAN, label: 'Violation', icon: <BiSolidErrorAlt /> },
  ]

  if (!mataPelajaran) return null
  return (
    <Tabs
      variant='secondary'
      activeItemKey={activeTabKey}
      onTabClick={newTab => {
        if (newTab === TabKey.ASSIGNMENT)
          navigate(
            AppNav.siswa.kelasDetailMataPelajaranDetailAssignment({
              kelasId: kelas.id,
              mataPelajaranId: mataPelajaran.id,
            }),
          )
        else if (newTab === TabKey.ATTACHMENT)
          navigate(
            AppNav.siswa.kelasDetailMataPelajaranDetailAttachment({
              kelasId: kelas.id,
              mataPelajaranId: mataPelajaran.id,
            }),
          )
        else if (newTab === TabKey.PENILAIAN)
          navigate(
            AppNav.siswa.kelasDetailMataPelajaranDetailPenilaian({
              kelasId: kelas.id,
              mataPelajaranId: mataPelajaran.id,
            }),
          )
        else if (newTab === TabKey.PELANGGARAN)
          navigate(
            AppNav.siswa.kelasDetailMataPelajaranDetailPelanggaran({
              kelasId: kelas.id,
              mataPelajaranId: mataPelajaran.id,
            }),
          )
      }}
      items={items}
    />
  )
}
