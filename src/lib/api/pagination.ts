/**
 * Pagination types mirroring the NestJS backend pagination contract.
 * Source: nestjs-auth/src/common/dto/pagination.dto.ts
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}
