import { sanitize } from 'isomorphic-dompurify'

function sanitizeHtml(html: string) {
  return sanitize(html, {
    USE_PROFILES: { html: true },
  })
}

const HtmlUtils = {
  sanitizeHtml,
}

export default HtmlUtils
