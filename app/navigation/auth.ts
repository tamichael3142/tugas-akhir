const baseUrl = '/auth'

function login() {
  return `${baseUrl}/login`
}

const auth = {
  login,
}

export default auth
