import PrimaryAccountSeeder from './seeders/primary-account'
import HourSeeder from './seeders/hour'
import DaysSeeder from './seeders/days'

const seedFlags = {
  primaryAccount: false,
  hour: false,
  days: false,
}

export async function seed() {
  if (seedFlags.primaryAccount) await PrimaryAccountSeeder.seed()
  if (seedFlags.hour) await HourSeeder.seed()
  if (seedFlags.days) await DaysSeeder.seed()
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
