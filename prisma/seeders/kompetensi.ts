import { prisma } from '~/utils/db.server'

const data = [
  { id: 'UJIAN_1', label: 'Test 1', isConnectable: false },
  { id: 'UJIAN_2', label: 'Test 2', isConnectable: false },
  { id: 'UTS', label: 'Mid Test', isConnectable: false },
  { id: 'UJIAN_3', label: 'Test 3', isConnectable: false },
  { id: 'UJIAN_4', label: 'Test 4', isConnectable: false },
  { id: 'UAS', label: 'Final Test', isConnectable: false },
  { id: 'TUGAS_1', label: 'Assignment 1', isConnectable: true },
  { id: 'TUGAS_2', label: 'Assignment 2', isConnectable: true },
  { id: 'TES_1', label: 'Tes 1', isConnectable: true },
  { id: 'TES_2', label: 'Tes 2', isConnectable: true },
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
