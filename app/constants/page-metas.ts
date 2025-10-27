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
  adminMasterTahunAjaran: [
    { title: `Master Tahun Ajaran - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterKelas: [
    { title: `Master Kelas - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  adminMasterAccount: [
    { title: `Master Account - Admin | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Situs admin SBBS' },
  ],
  authLogin: [
    { title: `Login | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Masuk ke SBBS' },
  ],
  authForgotPassword: [
    { title: `Lupa Password | ${pages.defaultTitle} - ${sbbs.name.long}` },
    { name: 'description', content: 'Lupa password di SBBS' },
  ],
}

export default pageMetas
