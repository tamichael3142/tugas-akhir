const baseUrl = '/action/siswa'

function accountUploadProfileImage() {
  return `${baseUrl}/account/upload-profile-image`
}

const siswaAction = {
  baseUrl,
  accountUploadProfileImage,
}

export default siswaAction
