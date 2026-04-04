import { prisma } from '~/utils/db.server'

const data = [
  { id: 'UJIAN_1', label: 'Ujian 1' },
  { id: 'UJIAN_2', label: 'Ujian 2' },
  { id: 'UTS', label: 'UTS' },
  { id: 'UJIAN_3', label: 'Ujian 3' },
  { id: 'UJIAN_4', label: 'Ujian 4' },
  { id: 'UAS', label: 'UAS' },
  { id: 'TUGAS_1', label: 'Tugas 1' },
  { id: 'TUGAS_2', label: 'Tugas 2' },
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
