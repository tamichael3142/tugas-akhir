import { prisma } from '~/utils/db.server'

const data = [
  { id: 'UJIAN_1', label: 'Test 1' },
  { id: 'UJIAN_2', label: 'Test 2' },
  { id: 'UTS', label: 'Mid Test' },
  { id: 'UJIAN_3', label: 'Test 3' },
  { id: 'UJIAN_4', label: 'Test 4' },
  { id: 'UAS', label: 'Final Test' },
  { id: 'TUGAS_1', label: 'Assignment 1' },
  { id: 'TUGAS_2', label: 'Assignment 2' },
  { id: 'TES_1', label: 'Tes 1' },
  { id: 'TES_2', label: 'Tes 2' },
]

async function seed() {
  try {
    await prisma.kompetensi.createMany({
      data: data.map(item => ({
        id: item.id,
        label: item.label,
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
