const baseUrl = '/ortu'

/*
 * Ortu's lower level routes
 */
function dashboard() {
  return `${baseUrl}`
}

const ortu = {
  baseUrl,
  dashboard,
}

export default ortu
