const baseUrl = '/action/ortu'

function accountUploadProfileImage() {
  return `${baseUrl}/account/upload-profile-image`
}

const ortuAction = {
  baseUrl,
  accountUploadProfileImage,
}

export default ortuAction
