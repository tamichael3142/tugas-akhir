import sanitizeHtmlPackage from 'sanitize-html'

function sanitizeHtml(html: string) {
  return sanitizeHtmlPackage(html, {
    allowedTags: [...sanitizeHtmlPackage.defaults.allowedTags, 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    allowedAttributes: {
      ...sanitizeHtmlPackage.defaults.allowedAttributes,
      '*': ['class', 'style'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    },
    allowedSchemes: ['http', 'https', 'data', 'mailto'],
  })
}

const HtmlUtils = {
  sanitizeHtml,
}

export default HtmlUtils
