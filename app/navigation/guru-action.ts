const baseUrl = '/action/guru'

function masterPengumumanDelete({ pengumumanId }: { pengumumanId: string }) {
  return `${baseUrl}/master-pengumuman/${pengumumanId}/delete`
}

const guruAction = {
  baseUrl,
  masterPengumumanDelete,
}

export default guruAction
