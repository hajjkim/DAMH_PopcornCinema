// Pagination utilities
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationResult {
  skip: number;
  limit: number;
  page: number;
}

export const getPaginationParams = (
  page: string | number = 1,
  limit: string | number = 10
): PaginationResult => {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Number(limit) || 10);
  const skip = (pageNum - 1) * limitNum;

  return {
    skip,
    limit: limitNum,
    page: pageNum,
  };
};

export const calculatePaginationMetadata = (
  total: number,
  limit: number,
  page: number
) => {
  return {
    total,
    limit,
    page,
    pages: Math.ceil(total / limit),
  };
};
