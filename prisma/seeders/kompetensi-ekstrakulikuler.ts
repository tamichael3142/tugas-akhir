import { prisma } from '~/utils/db.server'

const data = [{ id: 'FS', label: 'Final Score' }]

async function seed() {
  try {
    await prisma.kompetensiEkstrakulikuler.createMany({
      data: data.map(item => ({
        id: item.id,
        label: item.label,
      })),
    })
  } catch (e) {
    console.log('ERROR! Failed to seed days.ts', e)
  }
}

const KompetensisEkstrakulikulerSeeder = {
  seed,
}

export default KompetensisEkstrakulikulerSeeder
