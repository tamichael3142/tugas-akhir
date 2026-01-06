import { prisma } from '~/utils/db.server'
import PasswordUtils from '~/utils/password.utils'

async function seed() {
  try {
    await prisma.akun.createMany({
      data: [
        {
          username: 'superadmin',
          firstName: 'Super',
          lastName: 'Admin',
          password: await PasswordUtils.hashPassword('superadmin'),
          role: 'ADMIN',
        },
      ],
    })
  } catch (e) {
    console.log('ERROR! Failed to seed primary-account.ts', e)
  }
}

const PrimaryAccountSeeder = {
  seed,
}

export default PrimaryAccountSeeder
