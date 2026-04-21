import { useLoaderData, useRevalidator } from '@remix-run/react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import SiswaPageContainer from '~/layouts/siswa/SiswaPageContainer'
import { LoaderDataSiswaPengumumanDetail } from '~/types/loaders-data/siswa'
import HtmlUtils from '~/utils/html.utils'

const sectionPrefix = 'siswa-pengumuman-detail'

export default function SiswaPengumumanDetailPage() {
  const loader = useLoaderData<LoaderDataSiswaPengumumanDetail>()
  const revalidator = useRevalidator()

  if (revalidator.state === 'loading' || !loader.pengumuman) return <LoadingFullScreen />
  return (
    <SiswaPageContainer
      title={loader.pengumuman.nama}
      actions={[<BackButton key={`${sectionPrefix}-back-button`} label='Back' buttonProps={{ color: 'secondary' }} />]}
    >
      <Card>
        <div
          className='prose prose-sm md:prose-base max-w-none'
          dangerouslySetInnerHTML={{ __html: HtmlUtils.sanitizeHtml(loader.pengumuman.content) }}
        ></div>
      </Card>
    </SiswaPageContainer>
  )
}
