/**
 * Calculates pagination metadata.
 *
 * @param total - Total number of records in DB
 * @param page - Current page number (1-based)
 * @param limit - Records per page
 * @returns Pagination metadata
 */
export function getPaginationMeta(
  total: number,
  page: number,
  limit: number
) {
  // Calculate total pages
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return {
    total,
    totalPages,
    currentPage: page,
    limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1 && totalPages > 0,
  };
}