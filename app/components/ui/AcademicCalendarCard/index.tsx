import { TahunAjaran } from '@prisma/client'
import { useRouteLoaderData } from '@remix-run/react'
import Card from '~/components/ui/Card'

type Props = {
  title?: string
  currentTahunAjaran?: Partial<TahunAjaran> | null
  className?: string
}

type RootLoaderData = {
  googleCalendarEmbedUrl: string | null
}

export default function AcademicCalendarCard(props: Props) {
  const { title = 'Academic Calendar' } = props
  const rootData = useRouteLoaderData<RootLoaderData>('root')
  const embedUrl = rootData?.googleCalendarEmbedUrl

  if (embedUrl) {
    return (
      <Card className={props.className}>
        <h2 className='font-semibold text-xl mb-4'>{title}</h2>
        <iframe
          title='Academic Calendar'
          src={embedUrl}
          className='w-full'
          style={{ borderWidth: 0 }}
          width={800}
          height={600}
          frameBorder={0}
          scrolling='no'
        />
      </Card>
    )
  }

  return (
    <Card className={props.className}>
      <h2 className='font-semibold text-xl mb-4'>{title}</h2>
      <p className='text-neutral-500 text-sm'>
        No academic calendar configured. Set GOOGLE_CALENDAR_ID in environment variables.
      </p>
    </Card>
  )
}
