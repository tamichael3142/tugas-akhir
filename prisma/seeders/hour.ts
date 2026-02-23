import { prisma } from '~/utils/db.server'

const data = [
  '07:30',
  '07:45',
  '08:30',
  '09:15',
  '10:00',
  '10"15',
  '11:00',
  '11:45',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:15',
]

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
