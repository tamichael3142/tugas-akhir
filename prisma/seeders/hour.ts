import { prisma } from '~/utils/db.server'

const data = ['08:00', '08:45', '09:30', '10:15', '11:00', '11:45', '12:30', '13:15', '14:00', '14:45', '15:30']

async function seed() {
  try {
    await prisma.hour.createMany({
      data: data.map(item => ({
        id: item,
        label: item,
      })),
    })
  } catch (e) {
    console.log('ERROR! Failed to seed hour.ts', e)
  }
}

const HourSeeder = {
  seed,
}

export default HourSeeder
