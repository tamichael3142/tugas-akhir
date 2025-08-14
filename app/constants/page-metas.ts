import pages from './pages'
import sbbs from './sbbs'

const pageMetas = {
  default: [
    { title: `${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: sbbs.siteDescription },
  ],
}

export default pageMetas
