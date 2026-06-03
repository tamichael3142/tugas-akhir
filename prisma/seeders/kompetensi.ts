import { prisma } from '~/utils/db.server'

const data = [
  { id: 'PS_1', label: 'Assessment 1', isConnectable: false },
  { id: 'PS_2', label: 'Assessment 2', isConnectable: false },
  { id: 'PS_3', label: 'Assessment 3', isConnectable: false },
  { id: 'PAS', label: 'Final Test', isConnectable: false },
  { id: 'TUGAS_1', label: 'Assignment 1', isConnectable: true },
  { id: 'TUGAS_2', label: 'Assignment 2', isConnectable: true },
  { id: 'TUGAS_3', label: 'Assignment 3', isConnectable: true },
  { id: 'TUGAS_4', label: 'Assignment 4', isConnectable: true },
  { id: 'FS', label: 'Final Score', isConnectable: false },
]

async function seed() {
  try {
    await prisma.kompetensi.createMany({
      data: data.map(item => ({
        id: item.id,
        label: item.label,
        isConnectable: item.isConnectable,
      })),
    })
  } catch (e) {
    console.log('ERROR! Failed to seed days.ts', e)
  }
}

const KompetensisSeeder = {
  seed,
}

export default KompetensisSeeder
