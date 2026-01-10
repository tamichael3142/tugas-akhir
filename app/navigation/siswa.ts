const baseUrl = '/siswa'

/*
 * Siswa's lower level routes
 */
function dashboard() {
  return `${baseUrl}`
}

const siswa = {
  baseUrl,
  dashboard,
}

export default siswa
