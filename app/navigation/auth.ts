const baseUrl = '/auth'

function login() {
  return `${baseUrl}/login`
}

function forgotPassword() {
  return `${baseUrl}/forgot-password`
}

const auth = {
  login,
  forgotPassword,
}

export default auth
