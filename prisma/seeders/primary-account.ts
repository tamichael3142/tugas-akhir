import { Role } from '~/database/enums/prisma.enums'
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
          role: Role.ADMIN,
          isChangedPassword: true,
        },
        {
          username: 'gurudummy',
          firstName: 'Guru',
          lastName: 'Dummy',
          password: await PasswordUtils.hashPassword('gurudummy'),
          role: Role.GURU,
          isChangedPassword: true,
        },
        {
          username: 'ortudummy',
          firstName: 'Ortu',
          lastName: 'Dummy',
          password: await PasswordUtils.hashPassword('ortudummy'),
          role: Role.ORANGTUA,
          isChangedPassword: true,
        },
        {
          username: 'siswadummy',
          firstName: 'Siswa',
          lastName: 'Dummy',
          password: await PasswordUtils.hashPassword('siswadummy'),
          role: Role.SISWA,
          isChangedPassword: true,
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
