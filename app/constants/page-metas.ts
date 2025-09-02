import pages from './pages'
import sbbs from './sbbs'

const pageMetas = {
  default: [
    { title: `${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: sbbs.siteDescription },
  ],
  adminDefault: [
    { title: `Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  authLogin: [
    { title: `Login | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Masuk ke SBBS' },
  ],
}

export default pageMetas
