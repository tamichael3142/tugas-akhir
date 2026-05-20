import { prisma } from '~/utils/db.server'

async function seed() {
  try {
    await prisma.days.createMany({
      data: [
        { id: 'SENIN', label: 'Monday' },
        { id: 'SELASA', label: 'Tuesday' },
        { id: 'RABU', label: 'Wednesday' },
        { id: 'KAMIS', label: 'Thursday' },
        { id: 'JUMAT', label: 'Friday' },
      ],
    })
  } catch (e) {
    console.log('ERROR! Failed to seed days.ts', e)
  }
}

const DaysSeeder = {
  seed,
}

export default DaysSeeder
