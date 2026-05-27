import { prisma } from '~/utils/db.server'

async function seed() {
  try {
    await prisma.days.createMany({
      data: [
        { id: 'MON', label: 'Monday' },
        { id: 'TUE', label: 'Tuesday' },
        { id: 'WED', label: 'Wednesday' },
        { id: 'THU', label: 'Thursday' },
        { id: 'FRI', label: 'Friday' },
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
