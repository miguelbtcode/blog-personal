import { prisma } from "@/lib/prisma";
import type { PaginationMeta } from "@/types/api.types";

export abstract class BaseRepository {
  protected db = prisma;

  protected buildPagination(
    params: { page?: number; limit?: number },
    total: number
  ): PaginationMeta {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  protected buildOrderBy(sortBy?: string, sortOrder: "asc" | "desc" = "desc") {
    if (!sortBy) return {};
    return { [sortBy]: sortOrder };
  }
}
