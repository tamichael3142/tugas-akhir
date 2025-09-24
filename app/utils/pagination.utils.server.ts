/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/pagination.server.ts

export type PaginationParams<T> = {
  request: Request
  model: {
    findMany: (args: any) => Promise<T[]>
    count: (args?: any) => Promise<number>
  }
  options?: {
    where?: any
    orderBy?: any | any[]
    defaultLimit?: number
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
}

export async function getPaginatedData<T>({
  request,
  model,
  options,
}: PaginationParams<T>): Promise<PaginationReturns<T>> {
  const url = new URL(request.url)
  const page = Math.max(Number(url.searchParams.get('page')) || 1, 1)
  const limit = Math.max(Number(url.searchParams.get('limit')) || options?.defaultLimit || 10, 1)

  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    model.findMany({
      skip,
      take: limit,
      where: options?.where,
      orderBy: options?.orderBy ?? [{ createdAt: 'desc' }],
    }),
    model.count({ where: options?.where }),
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
  }
}
