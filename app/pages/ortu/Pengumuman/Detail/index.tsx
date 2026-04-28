import { useLoaderData, useRevalidator } from '@remix-run/react'
import { BackButton, Card, LoadingFullScreen } from '~/components/ui'
import OrtuPageContainer from '~/layouts/ortu/OrtuPageContainer'
import { LoaderDataOrtuPengumumanDetail } from '~/types/loaders-data/ortu'
import HtmlUtils from '~/utils/html.utils'

const sectionPrefix = 'ortu-pengumuman-detail'

export default function OrtuPengumumanDetailPage() {
  const loader = useLoaderData<LoaderDataOrtuPengumumanDetail>()
  const revalidator = useRevalidator()

  if (revalidator.state === 'loading' || !loader.pengumuman) return <LoadingFullScreen />
  return (
    <OrtuPageContainer
      title={loader.pengumuman.nama}
      actions={[<BackButton key={`${sectionPrefix}-back-button`} label='Back' buttonProps={{ color: 'secondary' }} />]}
    >
      <Card>
        <div
          className='prose prose-sm md:prose-base max-w-none'
          dangerouslySetInnerHTML={{ __html: HtmlUtils.sanitizeHtml(loader.pengumuman.content) }}
        ></div>
      </Card>
    </OrtuPageContainer>
  )
}
