import { prisma } from '~/utils/db.server'

const data = [
  { id: '07:30', label: '07:30' },
  { id: '07:45', label: '07:45' },
  { id: '08:30', label: '08:30' },
  { id: '09:15', label: '09:15' },
  { id: '10:00', label: '10:00' },
  { id: '10:15', label: '10:15' },
  { id: '11:00', label: '11:00' },
  { id: '11:45', label: '11:45' },
  { id: '12:30', label: '12:30' },
  { id: '13:00', label: '13:00' },
  { id: '13:30', label: '13:30' },
  { id: '14:00', label: '14:00' },
  { id: '14:30', label: '14:30' },
  { id: '15:00', label: '15:00' },
]

async function seed() {
  try {
    await prisma.hour.createMany({
      data: data.map(item => ({
        id: item.id,
        label: item.label,
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
