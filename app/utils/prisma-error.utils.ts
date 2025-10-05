// app/utils/prismaErrorHandler.ts
import { Prisma } from '@prisma/client'

export interface PrismaHandledError {
  status: number
  message: string
  code?: string
  type: 'known' | 'unknown'
}

export function prismaErrorHandler(error: unknown): PrismaHandledError {
  // ✅ Known Prisma error (misal: unique constraint, foreign key, not found, dll)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const { code } = error
    switch (code) {
      case 'P2002':
        return { status: 400, message: 'Data already exists.', code, type: 'known' }
      case 'P2003':
        return { status: 400, message: 'Foreign key constraint failed.', code, type: 'known' }
      case 'P2005':
        return { status: 400, message: 'Invalid field value.', code, type: 'known' }
      case 'P2025':
        return { status: 404, message: 'Record not found.', code, type: 'known' }
      case 'P2033':
        return { status: 400, message: 'Numeric overflow occurred.', code, type: 'known' }
      case 'P2024':
        return { status: 503, message: 'Database connection timeout.', code, type: 'known' }
      default:
        return { status: 500, message: `Database error (${code})`, code, type: 'known' }
    }
  }

  // ✅ Validation error (biasanya karena input tidak sesuai schema)
  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      status: 400,
      message: 'Invalid data format for database operation.',
      type: 'known',
    }
  }

  // ✅ Transaction / initialization error
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      status: 500,
      message: 'Failed to connect to database.',
      type: 'known',
    }
  }

  // ✅ Unknown error
  return {
    status: 500,
    message: 'Unexpected server error.',
    type: 'unknown',
  }
}
