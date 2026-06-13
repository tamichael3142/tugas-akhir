function isValidGoogleCalendarEmbedUrl(url?: string | null): boolean {
  if (!url) return false

  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return false
    if (parsed.hostname !== 'calendar.google.com') return false
    if (!parsed.pathname.startsWith('/calendar/embed')) return false
    return true
  } catch {
    return false
  }
}

// ? Otomatis update props jika import dari "Public URL to this calendar"
const defaultGoogleCalendarEmbedParams: Record<string, string> = {
  height: '600',
  wkst: '2',
  ctz: 'Asia/Jakarta',
  showPrint: '0',
  showCalendars: '0',
  showTabs: '0',
  showTitle: '0',
  color: '#039be5',
}

function buildGoogleCalendarEmbedUrl(url: string): string {
  const parsed = new URL(url)

  for (const [key, value] of Object.entries(defaultGoogleCalendarEmbedParams))
    if (!parsed.searchParams.has(key)) parsed.searchParams.set(key, value)

  return parsed.toString()
}

const UrlUtils = {
  isValidGoogleCalendarEmbedUrl,
  buildGoogleCalendarEmbedUrl,
}

export default UrlUtils
