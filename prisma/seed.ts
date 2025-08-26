import { prisma } from '~/db.server'

async function seed() {
  await prisma.akun.createMany({
    data: [
      { username: 'superadmin', password: 'superadmin', role: 'ADMIN' },
      { username: 'admin001', password: 'admin001', role: 'ADMIN' },
    ],
  })
}

seed()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
