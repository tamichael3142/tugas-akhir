import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined
}

function getPrismaClient() {
  const client = new PrismaClient({
    // log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  return client
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = getPrismaClient()
} else {
  if (global.__db) {
    // putuskan koneksi lama biar tidak ada prepared statement stale
    global.__db.$disconnect().catch(() => {})
  }
  global.__db = getPrismaClient()
  prisma = global.__db
}

export { prisma }
