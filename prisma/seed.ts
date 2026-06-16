import PrimaryAccountSeeder from './seeders/primary-account'
import HourSeeder from './seeders/hour'
import DaysSeeder from './seeders/days'
import KompetensisSeeder from './seeders/kompetensi'
import KompetensisEkstrakulikulerSeeder from './seeders/kompetensi-ekstrakulikuler'
import ImportExcelTemplateSeeder from './seeders/import-excel-template'

const seedFlags = {
  primaryAccount: false,
  hour: false,
  days: false,
  kompetensi: false,
  kompetensiEkstrakulikuler: false,
  importExcelTemplate: false,
}

export async function seed() {
  if (seedFlags.primaryAccount) await PrimaryAccountSeeder.seed()
  if (seedFlags.hour) await HourSeeder.seed()
  if (seedFlags.days) await DaysSeeder.seed()
  if (seedFlags.kompetensi) await KompetensisSeeder.seed()
  if (seedFlags.kompetensiEkstrakulikuler) await KompetensisEkstrakulikulerSeeder.seed()
  if (seedFlags.importExcelTemplate) await ImportExcelTemplateSeeder.seed()
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
