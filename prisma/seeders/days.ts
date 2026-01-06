import { prisma } from '~/utils/db.server'
import StringUtils from '~/utils/string-utils'

const data = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU']

async function seed() {
  try {
    await prisma.days.createMany({
      data: data.map(item => ({
        id: item,
        label: StringUtils.capitalize(item),
      })),
    })
  } catch (e) {
    console.log('ERROR! Failed to seed days.ts', e)
  }
}

const DaysSeeder = {
  seed,
}

export default DaysSeeder
