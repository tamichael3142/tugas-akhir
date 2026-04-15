import { Assignment } from '@prisma/client'

function getIsSubmittable(assignment: Assignment) {
  if (assignment.isSubmitable) return assignment.isSubmitable
  else {
    const now = new Date()
    return assignment.tanggalMulai <= now && now <= assignment.tanggalBerakhir
  }
}

const mapelAssignment = {
  getIsSubmittable,
}

export default mapelAssignment
