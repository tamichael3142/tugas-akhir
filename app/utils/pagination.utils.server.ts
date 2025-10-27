/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/pagination.server.ts

export type PaginationParams<T> = {
  request: Request
  model: {
    findMany: (args: any) => Promise<T[]>
    count: (args?: any) => Promise<number>
  }
  options?: {
    where?: Record<string, any>
    include?: Record<string, any>
    orderBy?: any | any[]
    defaultLimit?: number
    /**
     * Optional mapper untuk convert query params jadi Prisma where.
     * Misal: (query) => ({ name: { contains: query.search } })
     */
    mapQueryToWhere?: (query: URLSearchParams) => Record<string, any>
  }
}

export type PaginationReturns<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  filters: object
}

export async function getPaginatedData<T>({
  request,
  model,
  options,
}: PaginationParams<T>): Promise<PaginationReturns<T>> {
  const url = new URL(request.url)
  const query = url.searchParams

  const page = Math.max(Number(query.get('page')) || 1, 1)
  const limit = Math.max(Number(query.get('limit')) || options?.defaultLimit || 10, 1)
  const skip = (page - 1) * limit

  // 🔍 Bangun `where` condition gabungan
  const dynamicWhere = options?.mapQueryToWhere ? options.mapQueryToWhere(query) : {}
  const where = {
    ...options?.where,
    ...dynamicWhere,
  }

  const [data, total] = await Promise.all([
    model.findMany({
      skip,
      take: limit,
      where,
      include: options?.include,
      orderBy: options?.orderBy ?? [{ createdAt: 'desc' }],
    }),
    model.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    filters: Object.fromEntries(query.entries()),
  }
}
