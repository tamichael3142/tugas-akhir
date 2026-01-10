const baseUrl = '/auth'

function login() {
  return `${baseUrl}/login`
}

function logout() {
  return `/action${baseUrl}/logout`
}

function forgotPassword() {
  return `${baseUrl}/forgot-password`
}

const auth = {
  baseUrl,
  login,
  logout,
  forgotPassword,
}

export default auth
