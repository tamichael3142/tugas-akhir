const baseUrl = '/guru'

/*
 * Guru's lower level routes
 */
function dashboard() {
  return `${baseUrl}`
}

const guru = {
  baseUrl,
  dashboard,
}

export default guru
