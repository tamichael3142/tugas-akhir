const baseUrl = '/l-auth'

function setInitialPassword() {
  return `${baseUrl}/set-init-pass`
}

const lAuth = {
  baseUrl,
  setInitialPassword,
}

export default lAuth
