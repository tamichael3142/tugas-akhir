import PrimaryAccountSeeder from './seeders/primary-account'
import HourSeeder from './seeders/hour'
import DaysSeeder from './seeders/days'
import KompetensisSeeder from './seeders/kompetensi'

const seedFlags = {
  primaryAccount: false,
  hour: false,
  days: false,
  kompetensi: false,
}

export async function seed() {
  if (seedFlags.primaryAccount) await PrimaryAccountSeeder.seed()
  if (seedFlags.hour) await HourSeeder.seed()
  if (seedFlags.days) await DaysSeeder.seed()
  if (seedFlags.kompetensi) await KompetensisSeeder.seed()
}

// seed()
//   .then(async () => {
//     await prisma.$disconnect()
//     process.exit(0)
//   })
//   .catch(async e => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })
