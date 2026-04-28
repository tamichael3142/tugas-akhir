import { Pengumuman } from '@prisma/client'

const baseUrl = '/ortu'

/*
 * Ortu's lower level routes
 */
function dashboard() {
  return `${baseUrl}`
}

/*
 * Ortu's nilai siswa level routes
 */
const nilaiSiswaUrl = '/nilai'

function nilaiSiswa() {
  return `${baseUrl}${nilaiSiswaUrl}`
}

/*
 * Ortu's absensi siswa level routes
 */
const absensiSiswaUrl = '/absensi'

function absensiSiswa() {
  return `${baseUrl}${absensiSiswaUrl}`
}

/*
 * Ortu's pengumuman level routes
 */
const pengumumanUrl = '/pengumuman'

function pengumuman() {
  return `${baseUrl}${pengumumanUrl}`
}

function pengumumanDetail({ pengumumanId }: { pengumumanId: Pengumuman['id'] }) {
  return `${baseUrl}${pengumumanUrl}/${pengumumanId}/detail`
}

/*
 * Ortu's account level routes
 */
const accountUrl = '/account'

function account() {
  return `${baseUrl}${accountUrl}`
}

function accountChangePassword() {
  return `${baseUrl}${accountUrl}/change-password`
}

const ortu = {
  baseUrl,
  dashboard,
  nilaiSiswa,
  absensiSiswa,
  pengumuman,
  pengumumanDetail,
  account,
  accountChangePassword,
}

export default ortu
