import { prisma } from "@/lib/prisma";
import type { PaginationMeta } from "@/shared/types/api.types";

export abstract class BaseRepository {
  protected db = prisma;

  protected buildPagination(
    params: { page?: number; limit?: number },
    total: number
  ): PaginationMeta {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const pages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    };
  }

  protected buildOrderBy(sortBy?: string, sortOrder: "asc" | "desc" = "desc") {
    if (!sortBy) return {};
    return { [sortBy]: sortOrder };
  }
}
