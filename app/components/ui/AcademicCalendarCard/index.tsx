import { TahunAjaran } from '@prisma/client'
import { useNavigate } from '@remix-run/react'
import { Button } from '~/components/forms'
import Card from '~/components/ui/Card'
import { Role } from '~/database/enums/prisma.enums'
import AppNav from '~/navigation'
import useAuthStore from '~/store/authStore'
import UrlUtils from '~/utils/url.utils'

type Props = {
  title?: string
  currentTahunAjaran?: Partial<TahunAjaran> | null
  className?: string
  forceHideSetButton?: boolean
}

export default function AcademicCalendarCard(props: Props) {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const isAdmin = user?.role === Role.ADMIN
  const { title = 'Academic Calendar' } = props

  const embedUrl = props.currentTahunAjaran?.academicCalendarEmbedUrl
  const isEmbedUrlValid = UrlUtils.isValidGoogleCalendarEmbedUrl(embedUrl)

  if (embedUrl && isEmbedUrlValid) {
    return (
      <Card className={props.className}>
        <h2 className='font-semibold text-xl mb-4'>{title}</h2>
        <iframe
          title='Academic Calendar'
          src={UrlUtils.buildGoogleCalendarEmbedUrl(embedUrl)}
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

  if (!isAdmin) return null

  function handleSetEmbedUrl() {
    if (props.currentTahunAjaran && props.currentTahunAjaran.id)
      navigate(AppNav.admin.masterTahunAjaranEdit({ id: props.currentTahunAjaran.id }))
    else navigate(AppNav.admin.masterTahunAjaranCreate())
  }

  return (
    <Card className={props.className}>
      <h2 className='font-semibold text-xl mb-4'>{title}</h2>
      <p className='text-font-main mb-4'>No Academic Calendar has been configured for the current Academic Year.</p>
      {props.forceHideSetButton ? null : (
        <Button
          label="Set This Year's Embed Calendar Link"
          variant='contained'
          color='primary'
          buttonProps={{ onClick: handleSetEmbedUrl }}
        />
      )}
    </Card>
  )
}
